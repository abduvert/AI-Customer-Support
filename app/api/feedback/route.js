// app/api/feedback/route.js
import { db } from '/firebaseAdmin'; // Adjust the path as needed

export async function POST(request) {
  try {
    const { feedback, ratings } = await request.json();

    // Debugging: Log the received data
    console.log('Received data:', { feedback, ratings });

    // Extract the numeric part from the ratings string
    const ratingValue = parseInt(ratings, 10);

    // Validate the data
    if (typeof feedback !== 'string' || isNaN(ratingValue)) {
      console.log('Data validation failed');
      return new Response(JSON.stringify({ message: 'Invalid data' }), { status: 400 });
    }

    // Save the feedback to Firestore
    await db.collection('feedback').add({ feedback, ratings: ratingValue });

    // Send a successful response
    return new Response(JSON.stringify({ message: 'Feedback received' }), { status: 200 });
  } catch (error) {
    console.error('Feedback submission error:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}
