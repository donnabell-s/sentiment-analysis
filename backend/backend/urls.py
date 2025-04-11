from django.contrib import admin
from django.urls import path
from nlp_app.views import AnalyzeSentimentView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/analyze/', AnalyzeSentimentView.as_view(), name='analyze_sentiment'),
]