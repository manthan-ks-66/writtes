import app from "./app.js";
import connect from "./db/dbConnection.js";

let port_no = process.env.PORT_NO;

connect()
  .then(() => {
    app.listen(port_no, () => {
      console.log(`server is running on port no. ${port_no}`);
    });
  })
  .catch((error) => console.log(error.message));
