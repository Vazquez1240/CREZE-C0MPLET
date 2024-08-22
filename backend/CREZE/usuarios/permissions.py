from rest_framework import permissions
from rest_framework.permissions import SAFE_METHODS

#


class IsAuthenticatedAndSelfOrIsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.method in SAFE_METHODS or
            request.user and
            request.user.is_authenticated
        )

    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and (request.user == obj or request.user.is_superuser)


class IsAuthenticatedAndObjUserOrIsStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.method in SAFE_METHODS or
            request.user and
            request.user.is_authenticated
        )

    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and (request.user == obj.user or request.user.is_superuser)