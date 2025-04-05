const mongoose = require('mongoose')
const xlsx = require('xlsx');
const fs = require('fs');
const users = require('./routes/schemas/userSchema');
const policy = require('./routes/schemas/policySchema');
const company = require('./routes/schemas/carrierSchema');
const catagory = require('./routes/schemas/lobSchema');
const agentModel = require('./routes/schemas/agentSchema');
const userAccount = require('./routes/schemas/userAccountSchema');

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
        let [agent,	userType,	policy_mode,	producer,	policy_number,	premium_amount_written,	premium_amount,	policy_type,	company_name,	category_name,	policy_start_date,	policy_end_date,	csr,	account_name,	email,	gender,	firstname,	city,	account_type,	phone,	address,	state,	zip,	dob,	primary] = row;
        let agentData = await agentModel.findOneAndUpdate(
          { name: agent },
          { $set: { name: agent } },
          { new: true, upsert: true }
        );
        let excelData = {
          firstname: firstname,
          dob: dob,
          address: address,
          phone: phone,
          state: state,
          city: city,
          zip: zip,
          email: email,
          gender: gender,
          userType: userType,
          agentId: agentData._id
        }
        let user = await users.findOneAndUpdate(
          { firstname: firstname },
          { $set: excelData },
          { new: true, upsert: true }
        );
        let companyExcelData = {company_name: company_name}        
        let getcompany = await company.findOneAndUpdate(
          companyExcelData,
          { $set: companyExcelData },
          { new: true, upsert: true }
        )
        let catagoryExcelData = {category_name: category_name}
        let getcatagory = await catagory.findOneAndUpdate(
          catagoryExcelData,
          { $set: catagoryExcelData },
          { new: true, upsert: true }
        )
        let accountExcelData = {
          account_name: account_name,
          account_type: account_type,
        }
        let getaccount = await userAccount.findOneAndUpdate(
          {account_name: account_name},
          { $set: accountExcelData },
          { new: true, upsert: true }
        )
        
        let policyExcelData = {
          policy_number: policy_number,
          premium_amount_written: premium_amount_written,
          premium_amount: premium_amount,
          policy_type: policy_type,
          policy_mode: policy_mode,
          producer: producer,
          csr: csr,
          policy_start_date: policy_start_date,
          policy_end_date: policy_end_date,
          policyCategoryId: getcatagory._id,
          companyId: getcompany._id,
          accountId: getaccount._id,
          userId: user._id,
        }
        await policy.insertOne(policyExcelData)
      }
      fs.unlinkSync(filePath);
    }
    parentPort.postMessage('File processed successfully');
  } catch (error) {
    console.log(error,"Show errors");
    parentPort.postMessage(`Error: ${error.message}`);
  }
})();