from django.contrib import admin
from .models import User, Batch, Subject, Student, Teacher, AttendanceSession, AttendanceRecord, AuditLog, TimetableSlot, Syllabus

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_student', 'is_teacher', 'is_superuser')
    search_fields = ('username', 'email')
    list_filter = ('is_student', 'is_teacher', 'is_superuser')

@admin.register(Batch)
class BatchAdmin(admin.ModelAdmin):
    list_display = ('name', 'year')
    search_fields = ('name',)

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'batch')
    search_fields = ('name', 'code')
    list_filter = ('batch',)

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('user', 'batch', 'roll_number')
    search_fields = ('user__username', 'roll_number')
    list_filter = ('batch',)

@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('user',)
    search_fields = ('user__username',)

@admin.register(AttendanceSession)
class AttendanceSessionAdmin(admin.ModelAdmin):
    list_display = ('subject', 'batch', 'teacher', 'start_time', 'is_active')
    list_filter = ('is_active', 'batch', 'subject')
    search_fields = ('subject__name',)

@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ('student', 'session', 'timestamp', 'status')
    list_filter = ('status', 'session__subject')
    search_fields = ('student__user__username',)

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('action', 'user', 'timestamp')
    list_filter = ('timestamp', 'action')
    readonly_fields = ('timestamp',)

@admin.register(TimetableSlot)
class TimetableSlotAdmin(admin.ModelAdmin):
    list_display = ('day_of_week', 'start_time', 'end_time', 'subject', 'batch')
    list_filter = ('day_of_week', 'batch')

@admin.register(Syllabus)
class SyllabusAdmin(admin.ModelAdmin):
    list_display = ('subject', 'batch', 'title', 'uploaded_at')
    list_filter = ('batch', 'subject')
