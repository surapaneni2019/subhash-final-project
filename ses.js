const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1"
});

//if using ownaccount use dublin or frankfurt regions in the region field...

exports.sendEmail = function(to, subject, message) {
    console.log("message: ", message);
    return ses
        .sendEmail({
            Source: "Subhash <surapaneni_subhash1@yahoo.co.in>",
            Destination: {
                ToAddresses: [to]
            },
            Message: {
                Body: {
                    Text: {
                        Data: message
                    }
                },
                Subject: {
                    Data: subject
                }
            }
        })
        .promise()
        .then(() => console.log("Its functioning!"))
        .catch(error => console.log(error));
};
//IN the above function in source section type your real email and the name..
//wont keep the submit code option data in the cookie to prvent users not to
//skip going and looking for it in their email rather looking it in the
//cookie session...
//create a new table for passsword_reset_codes like
//CREATE TABLE password_reset_codes(
// id SERIAL PRIMARY KEY,
// code VARCHAR,
// email VARCHAR,
// created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// ); to be sure that the code is less than 10 min old. set some timeout for
//code to expire within 10 minutes....
