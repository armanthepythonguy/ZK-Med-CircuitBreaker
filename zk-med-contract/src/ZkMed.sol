// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {UltraVerifier} from "./plonk_vk.sol";

contract ZKMed is AccessControl{

    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 public constant PHARMACY_ROLE = keccak256("PHARMACY_ROLE");
    bytes32 public constant DOCTOR_ROLE = keccak256("DOCTOR_ROLE");

    struct Medicine{
        string name;
        string composition;
        uint256 mg;
        uint256 price;
        uint256 quantityAvailable;
        address pharmacy;
    }

    mapping (uint256 => Medicine) public medicines;
    uint256 public medCount = 0;

    UltraVerifier verifierContract;

    event MedicineOrder(uint256 _medId, uint256 _quantity, string _address);

    constructor(){
        _grantRole(OWNER_ROLE, msg.sender);
        verifierContract = new UltraVerifier();
    }

    function addDoctor(
        address _doctor
    ) external onlyRole(OWNER_ROLE){
        _grantRole(DOCTOR_ROLE, _doctor);
    }

    function addPharmacy(
        address _pharmacy
    ) external onlyRole(OWNER_ROLE){
        _grantRole(PHARMACY_ROLE, _pharmacy);
    }

    function addMedicine(
        string memory _name, 
        string memory _composition, 
        uint256 _mg,
        uint256 _price
        )external onlyRole(PHARMACY_ROLE){
        
        medicines[medCount] = Medicine(_name, _composition, _mg, _price, 0, msg.sender);
        medCount++;
    }


    function addInventory(
        uint256 _medId, 
        uint256 _quantity
        ) external onlyRole(PHARMACY_ROLE){
        medicines[_medId].quantityAvailable += _quantity;
    }

    function getPrice(
        uint256[] calldata _details
    ) public view returns(uint256 totalPrice){
        totalPrice = 0;
        for(uint256 i=0; i<_details.length; i=i+2){
            totalPrice += medicines[i].price * _details[i+1];
        }
    }

    function buyMedicine(
        bytes calldata _proof,
        bytes32[] calldata _publicInputs,
        string calldata _userAddress,
        uint256[] calldata _details
    )external payable{
        require(hasRole(DOCTOR_ROLE, address(uint160(uint256(_publicInputs[0])))), "Not a whitelisted doctor !!!");
        require(verifierContract.verify(_proof, _publicInputs), "Fake Proof Uploaded !!!!");
        require(msg.value >= getPrice(_details), "Less value passed !!!");
        for(uint256 i=0; i<_details.length; i=i+2){
            if(medicines[i].quantityAvailable >= _details[i+1]){
                medicines[i].quantityAvailable -= _details[i+1];
                payable(medicines[i].pharmacy).transfer(medicines[i].price * _details[i+1]);
                emit MedicineOrder(i, _details[i+1], _userAddress);
            }
        }
    }

}
