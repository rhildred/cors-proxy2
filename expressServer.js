import createApp from './__tests__/expressFixture.js';

let app = createApp();

let listener = app.listen(8080, ()=>{
    console.log(`server started on ${listener.address().port}`);
})