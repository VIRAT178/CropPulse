package com.croppulse.backend.Controller;

import com.croppulse.backend.Model.Notification;
import com.croppulse.backend.Response.ApiResponse;
import com.croppulse.backend.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    /**
     * Get all notifications for the current user
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Notification>>> getUserNotifications(
            @RequestParam(required = false, defaultValue = "false") boolean unreadOnly) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Object principalObj = auth.getPrincipal();
            
            Long userId;
            String userType;
            
            if (principalObj instanceof Map) {
                Map<String, Object> principal = (Map<String, Object>) principalObj;
                Object idObj = principal.get("id");
                Object roleObj = principal.get("role");
                
                // Check if values are null (old token without userId)
                if (idObj == null || roleObj == null) {
                    return ResponseEntity.status(401)
                        .body(new ApiResponse<>(false, "Session expired. Please log in again.", null));
                }
                
                userId = Long.valueOf(idObj.toString());
                userType = roleObj.toString();
            } else {
                // Old token format - ask user to log in again
                return ResponseEntity.status(401)
                    .body(new ApiResponse<>(false, "Session expired. Please log in again.", null));
            }

            List<Notification> notifications = unreadOnly 
                ? notificationService.getUnreadNotifications(userId, userType)
                : notificationService.getUserNotifications(userId, userType);

            return ResponseEntity.ok(new ApiResponse<>(true, "Notifications retrieved", notifications));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Failed to get notifications: " + e.getMessage(), null));
        }
    }

    /**
     * Get unread notification count
     */
    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Object principalObj = auth.getPrincipal();
            
            Long userId;
            String userType;
            
            if (principalObj instanceof Map) {
                Map<String, Object> principal = (Map<String, Object>) principalObj;
                Object idObj = principal.get("id");
                Object roleObj = principal.get("role");
                
                // Check if values are null (old token without userId)
                if (idObj == null || roleObj == null) {
                    return ResponseEntity.status(401)
                        .body(new ApiResponse<>(false, "Session expired. Please log in again.", null));
                }
                
                userId = Long.valueOf(idObj.toString());
                userType = roleObj.toString();
            } else if (principalObj instanceof String) {
                // Old token format - ask user to log in again
                return ResponseEntity.status(401)
                    .body(new ApiResponse<>(false, "Session expired. Please log in again.", null));
            } else {
                throw new RuntimeException("Unexpected principal type: " + principalObj.getClass().getName());
            }

            Long count = notificationService.getUnreadCount(userId, userType);
            return ResponseEntity.ok(new ApiResponse<>(true, "Count retrieved", count));
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Failed to get count: " + e.getMessage(), null));
        }
    }

    /**
     * Mark a notification as read and delete it
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<String>> markAsRead(@PathVariable Long id) {
        try {
            notificationService.markAsRead(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Notification deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Failed to mark as read: " + e.getMessage(), null));
        }
    }

    /**
     * Delete a notification
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteNotification(@PathVariable Long id) {
        try {
            notificationService.deleteNotification(id);
            return ResponseEntity.ok(new ApiResponse<>(true, "Notification deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Failed to delete notification: " + e.getMessage(), null));
        }
    }

    /**
     * Mark all notifications as read
     */
    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<String>> markAllAsRead() {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            Object principalObj = auth.getPrincipal();
            
            Long userId;
            String userType;
            
            if (principalObj instanceof Map) {
                Map<String, Object> principal = (Map<String, Object>) principalObj;
                Object idObj = principal.get("id");
                Object roleObj = principal.get("role");
                
                // Check if values are null (old token without userId)
                if (idObj == null || roleObj == null) {
                    return ResponseEntity.status(401)
                        .body(new ApiResponse<>(false, "Session expired. Please log in again.", null));
                }
                
                userId = Long.valueOf(idObj.toString());
                userType = roleObj.toString();
            } else {
                return ResponseEntity.status(401)
                    .body(new ApiResponse<>(false, "Session expired. Please log in again.", null));
            }

            notificationService.markAllAsRead(userId, userType);
            return ResponseEntity.ok(new ApiResponse<>(true, "All notifications marked as read", null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Failed to mark all as read: " + e.getMessage(), null));
        }
    }
}
