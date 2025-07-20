
import { clerkClient } from "@clerk/express"
import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"
import User from "../models/User.js"
import { v2 as cloudinary } from "cloudinary"
export const getUserData=async(req,res)=>{
const {userId}=await req.auth()

 try {
    let user = await User.findById(userId);

    if (!user) {
      // Fetch data from Clerk to auto-create user
      const clerkUser = await clerkClient.users.getUser(userId);
      const { firstName, lastName, emailAddresses, imageUrl } = clerkUser;

      const newUser = new User({
        _id: userId,
        name: `${firstName} ${lastName}`,
        email: emailAddresses[0].emailAddress,
        image: imageUrl,
      });

      user = await newUser.save();
    }

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}
export const applyForJob=async(req,res)=>{
 const {jobId}=req.body
 const {userId}=await req.auth()
 try {
    const isAlreadyApplied=await JobApplication.find({jobId,userId})
    if(isAlreadyApplied.length>0){
        return res.json({success:false,message:'You have already applied for this job'})
    }
    const jobData=await Job.findById(jobId)
    if(!jobData){
        return res.json({success:false,message:'Job Not Found'})
    }
    await JobApplication.create({
        companyId:jobData.companyId,
        userId,
        jobId,
        date:Date.now()

    })
    res.json({success:true,message:'Job Applied Successfully'})
 } catch (error) {
    res.json({success:false,message:error.message})
    
 }
}
export const getUserJobApplications=async(req,res)=>{
try {
    const {userId}=await req.auth()
    const applications=await JobApplication.find({userId})
    .populate('companyId','name email image')
    .populate('jobId','title description location category level salary')
    .exec()
    if(!applications){
        return res.json({success:false,message:'No Job Applications Found'})
    }
    return res.json({success:true,applications})
} catch (error) {
    res.json({success:false,message:error.message})
    
}
}
export const updateUserResume=async(req,res)=>{
    try {
        const {userId}=await req.auth()
        const resumeFile=req.file
        const userData=await User.findById(userId)
        if(resumeFile){
            const resumeUpload=await cloudinary.uploader.upload(resumeFile.path)
            userData.resume=resumeUpload.secure_url
        }
        await userData.save()
        return res.json({success:true,message:'Resume Updated Successfully'})
        
    } catch (error) {
        res.json({success:false,message:error.message})
        
    }
}