import { Grid } from "@mui/material";
import "../pages/doctorForm.css";
import upload from "../public/Images/upload-icon-.png";
import uploadContainer from "../public/Images/upload.png";
import { useState } from "react";
import { useNavigate } from "react-router";
import abi from "../abi/abi.json";

function ClientUpload(){
  const ethers = require("ethers");
    const [file, setFile] = useState();
  const navigate=useNavigate();
        const handleFileChange = (e) => {
            if (e.target.files) {
              var reader = new FileReader();
              reader.onload = function(event) {
                // The file's text will be printed here
                console.log(event.target.result,"result")
                setFile(event.target.result)
              };
            
              reader.readAsText(e.target.files[0]);
            }
          };

          const uploadFile=async()=>{
            const uploadedData = JSON.parse(file);
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract("0x1A44477AF531Ab811cd82772477f40750e763ff9",abi,signer);
            // set the price value
            //  let price = await contract.getPrice();
            let price = await contract.getPrice(uploadedData.medicines);
            navigate("/clientForm",{state:{file:uploadedData,price:price}})
          }
    
    return(
        <div className="doctor-main">
        <Grid container justifyContent={"center"} alignContent={"center"} alignItems={"center"}>
            
    <Grid item xs={12} justifyContent={"center"} alignContent={12} alignItems={12}>
        <div className="main-container">
    <div className="login-header">
        <div style={{width:"inherit",display:"flex",justifyContent:"flex-start"}}>
       <h1> UPLOAD PROOF</h1>
       </div>
       </div>
      
   <Grid container item xs={12} alignItems={"center"} alignContent={"center"} justifyContent={"center"}>

<div className="content-login">

<div className="inner-form" >
{/* <input className="custom-file-input" type="file" onChange={handleFileChange} /> */}
<div class="image-upload-wrap">
    <input class="file-upload-input" type='file' onChange={handleFileChange} accept="image/*" />
    <div class="drag-text">
      <h2>Drag and drop a file</h2>
    </div>
  </div>
  {file?
  <>
  <div class="file-upload-content">
   <span style={{color:"whitesmoke",fontSize:"18px",fontFamily:"Outfit, sans-serif"}}>{file?.name}</span>
    {/* <div class="image-title-wrap">
      <button type="button" onClick={removeUpload} class="remove-image">Remove <span class="image-title">Uploaded File</span></button>
    </div> */}
  </div>

  <div className="btn-container">
    <img width="45px" height="45px" src={upload} alt="upload"/>
<button className="btn-upload" onClick={uploadFile}>Upload</button>
</div></>
:""}
</div>

</div>
</Grid>
    </div>
    </Grid>
        </Grid>
        </div>
        )
}
export default ClientUpload;