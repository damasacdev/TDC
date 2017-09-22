var notify = {
    alertNotify: function alertNotify(job) {
        const notification = {
            title: 'TDC working',
            body: job,
            width: 50
                // icon: '../favicon.png'
        }
        new window.Notification(notification.title, notification);
    },

}
module.exports = notify;