import mongoose from "mongoose";

const JobApplicationSchema=new mongoose.Schema({
    userId:{type:String,ref:'User',rquired:true},
    companyId:{type:mongoose.Schema.Types.ObjectId,ref:'Company',rquired:true},
    jobId:{type:String,ref:'Job',rquired:true},
    status:{type:String,default:'Pending'},
    date:{type:Number,rquired:true}
})
const JobApplication=mongoose.model('JobApplication',JobApplicationSchema);
export default JobApplication