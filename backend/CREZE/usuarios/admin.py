from django.contrib import admin
from .models import User, Group, Documento
from django.contrib.auth.models import Group as OriginalGroup
from django.contrib import auth

@admin.register(User)
class UserAdmin(auth.admin.UserAdmin):
    list_display = ('email','is_active', 'is_staff')

    def get_readonly_fields(self, request, obj=None):
        if request.user.is_superuser:
            return ()
        if request.user.is_staff:
            return ('is_staff', 'groups', 'user_permissions')
        return (auth.admin.UserAdmin.fields)

admin.site.register(Group)
admin.site.unregister(OriginalGroup)
admin.site.register(Documento)
