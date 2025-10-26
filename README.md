# ServerlessAPI
After creating account on Serverless framework use these csmmands on your terminal for intallation

npm install -g serverless
and also authenticate with the serverless account created on redirected browser.

now after creating npm files install npm dependencies by 
- npm install

Then to start use 
- npm start  

if you want to send mail by terminal use curl 
curl -X POST http://localhost:3000/dev/send-email \
  -H "Content-Type: application/json" \
  -d '{
    "receiver_email": "provide_receiver_email",
    "subject": "Test",
    "body_text": "Testing!"
  }'


you can also use frontend and simply send the message by UI created in html file



The API will run at: `http://localhost:3000/dev/send-email` where we send post request.
