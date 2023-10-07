const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const specReqString = { type: String, default: "" };

const teamSchema = new Schema(
    {
        creativeparticipant1: specReqString,
        creativeparticipant2: specReqString,
        creativeparticipant3: specReqString,
        creativeparticipant4: specReqString,
        creativeparticipant5: specReqString,
        creativeparticipant6: specReqString,
        crossparticipant1: specReqString,
        crossparticipant2: specReqString,
        gdparticipant1: specReqString,
        surpparticipant1: specReqString,
        surpparticipant2: specReqString,
        progparticipant1: specReqString,
        progparticipant2: specReqString,
        filmparticipant1: specReqString,
        filmparticipant2: specReqString,
        filmparticipant3: specReqString,
        filmparticipant4: specReqString,
        gamingparticipant1: specReqString,
        gamingparticipant2: specReqString,
        quizparticipant1: specReqString,
        roboticsparticipant1: specReqString,
        roboticsparticipant2: specReqString,
        roboticsparticipant3: specReqString,
        photoparticipant1: specReqString,
        paintparticipant1: specReqString,
        gamedevparticipant1: specReqString,
        gamedevparticipant2: specReqString,
        minecraftparticipant1: specReqString,
        minecraftparticipant2: specReqString,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);