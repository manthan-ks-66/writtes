// fn parameter & arg var name chack
// error class analyzing

function test(name) {
  return name + " Kumar";
}

const firstName = "Manthan";

const res = test(firstName);

let user = {
  name: "Manthan",
  username: "manthanks",
  id: 129745934,
};

function testTwo({ user }) {
  console.log(user);
}

// testTwo({ user });

const jsUser = {
  "full name": "Manthan Srivastav",
  username: "manthan_ks",
  email: "manthan@gmail.com",
  id: 123456,
};

// console.log(jsUser["full name"])