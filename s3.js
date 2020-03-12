//this file will connect our node server to aws cloud like uploading a function.

const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in production the secrets are environment variables
} else {
    secrets = require("./secrets"); // in local(dev) they are in secrets.json which is listed in .gitignore
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET
});
//this above const s3 javascript object(creating a aws client) connects our node server to amazon
//

exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("no file :( ");
        return res.sendStatus(500);
    } //this is a middleware everytime a client uploading a file
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "spicedling",
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size
        })
        .promise();

    promise
        .then(() => {
            console.log("image made it way to amazon! :)");
            next();
            fs.unlink(path, () => {}); //if we dont want to save the images from upload folder
            //but if you want to have the folders within your uploads folder get
            //rid of the fs.unlink function.
        })
        .catch(err => {
            console.log("error in putObject of s3.js: ", err);
            res.sendStatus(500);
        });
};
//If everything works we are uploading a put request is the purpose of  putObject
//*change a Bucket name from spicedling to your own Bucketname* if you have your own credentials
