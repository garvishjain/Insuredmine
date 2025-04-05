const mongoose = require('mongoose')
const xlsx = require('xlsx');
const fs = require('fs');
const users = require('./routes/schemas/userSchema');
const policy = require('./routes/schemas/policySchema');
const company = require('./routes/schemas/carrierSchema');
const catagory = require('./routes/schemas/lobSchema');
const agent = require('./routes/schemas/agentSchema');

const uri = "mongodb+srv://garvishjain1997:Garvishinsuredmine@insuredmine.aiho7ag.mongodb.net/?retryWrites=true&w=majority&appName=Insuredmine";

/** MongoDB Connection */
mongoose.connect(uri,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
  maxPoolSize: 10 /** Limit max connections */
})
  .then(()=>console.log('MongoDB Connected'))
  .catch((err)=>console.log("Mongo error",err))

/** Worker Thread for File Processing */
const { parentPort, workerData } = require('worker_threads');
(async () => {
  try {
    const filePath = workerData;
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = xlsx.utils.sheet_to_json(sheet, {header: 1});
    if(data.length > 0){
      headerRows = data[0].map(cell => cell.toLowerCase());
      for (const row of data.slice(1)) {
        let [firstname,dob,address,phonenumber,state,zipcode,email,gender,usertype,policyNumber,policyStartDate,policyEndDate,policyCategory,companyname,agentName] = row;
        let agentData = await agent.findOneAndUpdate(
          { name: agentName },
          { $set: { name: agentName } },
          { new: true, upsert: true }
        );
        let excelData = {
          firstName: firstname,
          DOB: dob,
          address:address,
          phoneNumber: phonenumber,
          state: state,
          zipCode: zipcode,
          email: email,
          gender: gender,
          userType: usertype,
          agentId: agentData._id
        }
        let user = await users.findOneAndUpdate(
          { firstName: firstname },
          { $set: excelData },
          { new: true, upsert: true }
        );
        let companyExcelData = {companyName: companyname}        
        let getcompany = await company.findOneAndUpdate(
          {companyName: companyname},
          { $set: companyExcelData },
          { new: true, upsert: true }
        )
        let catagoryExcelData = {categoryName: policyCategory}
        let getcatagory = await catagory.findOneAndUpdate(
          catagoryExcelData,
          { $set: catagoryExcelData },
          { new: true, upsert: true }
        )
        
        let policyExcelData = {
          policyNumber: policyNumber,
          policyStartDate: policyStartDate,
          policyEndDate: policyEndDate,
          policyCategoryId: getcatagory._id,
          companyId: getcompany._id,
          userId: user._id,
        }
        await policy.insertOne(policyExcelData)
      }
    }

    fs.unlinkSync(filePath);
    parentPort.postMessage('File processed successfully');
  } catch (error) {
    console.log(error,"Show errors");
    parentPort.postMessage(`Error: ${error.message}`);
  }
})();