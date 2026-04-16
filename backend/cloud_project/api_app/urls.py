from rest_framework.routers import DefaultRouter
from api_app.views import UsersModelViewSet


router = DefaultRouter()

router.register('users', UsersModelViewSet)

urlpatterns = router.urls