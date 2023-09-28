const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reqString = { type: String, required: true };
const nonReqString = { type: String, required: false };

const userSchema = new Schema(
    {
        regType: reqString,
        school: {
            schoolName: reqString,
            schoolAddress: reqString,
            schoolEmail: reqString,
            clubName: nonReqString,
            clubEmail: nonReqString,
            clubWebsite: nonReqString,
            teacherName: reqString,
            teacherEmail: reqString,
            teacherPhone: reqString,
            studentName: reqString,
            studentEmail: reqString,
            studentPhone: reqString,
            userId: reqString,
            pass: reqString,
            discordCode: reqString,
        },
        indi: {
            firstName: reqString,
            lastName: reqString,
            email: reqString,
            phone: reqString,
            userId: reqString,
            pass: reqString,
            discordCode: reqString,
            dob: reqString,
            grade: reqString,
            schname: reqString,
        },
        teamSchemaID: nonReqString,
        admin: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("School", userSchema);