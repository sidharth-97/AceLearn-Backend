const admin = require("firebase-admin");
const serviceAccount = require("../../../firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const sendNotification = async (token:string) => {
    const message = {
        notification: {
          title: 'Reminder',
          body: `Your class will start in an hour`,
          // imageUrl:"https://res.cloudinary.com/dne4av79d/image/upload/v1701683433/chat-image/cvnnnakxfpen1srgwl2g.png"
        },
        data: {
          exampleKey: 'exampleValue',
        },
        token:token
      };
      admin.messaging().send(message)
    .then(() => {
      console.log('Notification sent successfully:');
    })
    .catch((error:any) => {
      console.error('Error sending notification:',error);
    });
}