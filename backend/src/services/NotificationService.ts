// Simple notification service (stub)
export class NotificationService {
  sendTaskReminder(userEmail: string, taskTitle: string, dueDate: Date) {
    // Integrate with email/SMS/push provider in production
    console.log(`Reminder: Task '${taskTitle}' is due on ${dueDate} for ${userEmail}`);
  }

  sendDueDateAlert(userEmail: string, taskTitle: string, dueDate: Date) {
    console.log(`Alert: Task '${taskTitle}' is due soon (${dueDate}) for ${userEmail}`);
  }

  sendTaskAssignment(userEmail: string, taskTitle: string) {
    console.log(`Notification: You have been assigned to task '${taskTitle}' (${userEmail})`);
  }
}
