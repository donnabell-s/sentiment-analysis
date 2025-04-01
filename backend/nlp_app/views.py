from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk
import re
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import logging

logger = logging.getLogger(__name__)

nltk.download('punkt_tab')
nltk.download('stopwords')
nltk.download('vader_lexicon')

sia = SentimentIntensityAnalyzer()

def clean_text(text):
    """Clean and preprocess text for sentiment analysis."""
    if not text or not isinstance(text, str):
        return ""
    
    # Remove URLs, special chars, and numbers
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\d+', '', text)
    text = text.lower().strip()
    
    # Tokenize and remove stopwords
    try:
        tokens = word_tokenize(text)
        stop_words = set(stopwords.words('english'))
        tokens = [word for word in tokens if word not in stop_words and len(word) > 1]
        return ' '.join(tokens)
    except Exception as e:
        logger.error(f"Text cleaning failed: {e}")
        return text  # Return original if cleaning fails



class AnalyzeSentimentView(APIView):
    def post(self, request):
        text = request.data.get('text', '')
        
        if not text or not isinstance(text, str):
            return Response(
                {'error': 'Valid text is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            cleaned_text = clean_text(text)
            sentiment_scores = sia.polarity_scores(cleaned_text)
            
            # Convert scores to percentage
            negative_percentage = sentiment_scores['neg'] * 100
            neutral_percentage = sentiment_scores['neu'] * 100
            positive_percentage = sentiment_scores['pos'] * 100
            

            # Extract sentiment scores
            negative_score = sentiment_scores['neg']
            neutral_score = sentiment_scores['neu']
            positive_score = sentiment_scores['pos']
            compound = sentiment_scores['compound']

            # Adjusted logic to consider neutral score
            if neutral_score > positive_score and neutral_score > negative_score:
                sentiment = 'Neutral'
            elif compound >= 0.05:
                sentiment = 'Positive'
            elif compound <= -0.05:
                sentiment = 'Negative'
            else:
                sentiment = 'Neutral'
            
            return Response({
                'original_text': text,
                'processed_text': cleaned_text,
                'sentiment': sentiment,
                'scores': {
                    'negative': negative_percentage,
                    'neutral': neutral_percentage,
                    'positive': positive_percentage,
                    'compound': compound
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


