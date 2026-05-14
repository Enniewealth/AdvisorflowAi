from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


User = get_user_model()


class LoginSerializer(TokenObtainPairSerializer):
    default_error_messages = {
        "no_active_account": (
            "No advisor account was found with those credentials. "
            "Check the email and password, or register a new account first."
        )
    }

    def validate(self, attrs):
        email = attrs.get(self.username_field)
        if email:
            user = User.objects.filter(email__iexact=email.strip()).first()
            if user:
                attrs[self.username_field] = user.email
        return super().validate(attrs)


class AdvisorSerializer(serializers.ModelSerializer):
    def validate_email(self, value):
        email = value.strip().lower()
        queryset = User.objects.filter(email__iexact=email)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("An advisor account with this email already exists.")
        return email

    class Meta:
        model = User
        fields = (
            "id",
            "name",
            "email",
            "role",
            "agency_name",
            "subscription_status",
            "date_joined",
        )
        read_only_fields = ("id", "role", "subscription_status", "date_joined")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ("id", "name", "email", "password", "agency_name")
        read_only_fields = ("id",)

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("An advisor account with this email already exists.")
        return email

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            name=validated_data["name"],
            agency_name=validated_data.get("agency_name", ""),
        )


class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, validators=[validate_password])
