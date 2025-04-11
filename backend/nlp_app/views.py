from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk
import re
from nltk.tokenize import TweetTokenizer
from nltk.corpus import stopwords
import logging
from .amplifiers import get_amplifier
from .negations import NEGATE

logger = logging.getLogger(__name__)

nltk.download('punkt')
nltk.download('vader_lexicon')

sia = SentimentIntensityAnalyzer()
stop_words = set(stopwords.words('english'))

def preprocess_text(text):
    if not text or not isinstance(text, str):
        return {'tokens': [], 'cleaned_text': ''}
    
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    text = re.sub(r'\d+', '', text)
    
    tokenizer = TweetTokenizer(preserve_case=False, reduce_len=True, strip_handles=True)
    tokens = tokenizer.tokenize(text)
    
    filtered_tokens = [
        token for token in tokens 
        if token not in stop_words or token.lower() in NEGATE or get_amplifier(token.lower()) is not None
    ]

    # filtered_tokens = [
    #     token for token in tokens 
    #     if token not in stop_words or token.lower() in NEGATE
    # ]
    
    return {
        'tokens': filtered_tokens,
        'cleaned_text': ' '.join(filtered_tokens)
    }


def analyze_with_amplifiers(tokens):
    lexicon = sia.lexicon
    
    for i, token in enumerate(tokens[:-1]):
        booster = get_amplifier(token.lower())
        if booster:
            target_word = tokens[i+1].lower()
            if target_word in lexicon:
                lexicon[target_word] *= (1 + booster)
    
    filtered_tokens = [
        token for token in tokens
        if not get_amplifier(token.lower())
    ]
    text = ' '.join(filtered_tokens)

    print(text)
    
    scores = sia.polarity_scores(text)
    
    sia.lexicon = sia.make_lex_dict()
    
    return scores


class AnalyzeSentimentView(APIView):
    def post(self, request):
        text = request.data.get('text', '')
        
        if not text or not isinstance(text, str):
            return Response(
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            processed = preprocess_text(text)
            sentiment_scores = analyze_with_amplifiers(processed['tokens'])
            # sentiment_scores = sia.polarity_scores(' '.join(processed['tokens']))
            
            negative_percentage = sentiment_scores['neg'] * 100
            neutral_percentage = sentiment_scores['neu'] * 100
            positive_percentage = sentiment_scores['pos'] * 100
            
            if positive_percentage > max(negative_percentage, neutral_percentage):
                sentiment = 'Positive'
            elif negative_percentage > max(positive_percentage, neutral_percentage):
                sentiment = 'Negative'
            else:
                sentiment = 'Neutral'
            
            return Response({
                'original_text': text,
                'processed_text': processed['cleaned_text'],
                'sentiment': sentiment,
                'scores': {
                    'negative': negative_percentage,
                    'neutral': neutral_percentage,
                    'positive': positive_percentage,
                    'compound': sentiment_scores['compound']
                }
            })

        except Exception as e:
            logger.error(f"Sentiment analysis failed: {e}")
            return Response(
                {'error': 'Analysis failed'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get(self, request):
        return Response({
            'message': 'Send a POST request with "text" parameter for analysis.',
        })