package org.krino.voting_system.web3.contracts;

import io.reactivex.Flowable;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Array;
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.datatypes.CustomError;
import org.web3j.abi.datatypes.DynamicArray;
import org.web3j.abi.datatypes.DynamicBytes;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.generated.Bytes32;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.abi.datatypes.generated.Uint8;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.BaseEventResponse;
import org.web3j.protocol.core.methods.response.Log;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

/**
 * <p>Auto generated code.
 * <p><strong>Do not modify!</strong>
 * <p>Please use the <a href="https://docs.web3j.io/command_line.html">web3j command line tools</a>,
 * or the org.web3j.codegen.SolidityFunctionWrapperGenerator in the 
 * <a href="https://github.com/LFDT-web3j/web3j/tree/main/codegen">codegen module</a> to update.
 *
 * <p>Generated with web3j version 1.7.0.
 */
@SuppressWarnings("rawtypes")
public class Election extends Contract {
    public static final String BINARY = "0x610120604052348015610010575f5ffd5b506040516123613803806123618339818101604052810190610032919061042e565b5f73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff16148061008257505f8573ffffffffffffffffffffffffffffffffffffffff163b145b156100b9576040517f1312996d00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff160361011e576040517fb25e05c400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f8303610157576040517f7675af5400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b428211610190576040517f4626ceb800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b8473ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff16815250508373ffffffffffffffffffffffffffffffffffffffff1660a08173ffffffffffffffffffffffffffffffffffffffff16815250508260c081815250508160e081815250508061010081815250505f60035f6101000a81548160ff02191690836002811115610235576102346104a5565b5b021790555061024a838561025460201b60201c565b50505050506104d2565b8060015f8481526020019081526020015f205f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550817ff0adfb94eab6daf835deb69c5738fe636150c3dfd08094a76f39b963dc8cb05a60405160405180910390a28073ffffffffffffffffffffffffffffffffffffffff165f73ffffffffffffffffffffffffffffffffffffffff16837f0ba83579a0e79193ef649b9f5a8759d35af086ba62a3e207b52e4a8ae30d49e360405160405180910390a45050565b5f5ffd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61035c82610333565b9050919050565b5f61036d82610352565b9050919050565b61037d81610363565b8114610387575f5ffd5b50565b5f8151905061039881610374565b92915050565b6103a781610352565b81146103b1575f5ffd5b50565b5f815190506103c28161039e565b92915050565b5f819050919050565b6103da816103c8565b81146103e4575f5ffd5b50565b5f815190506103f5816103d1565b92915050565b5f819050919050565b61040d816103fb565b8114610417575f5ffd5b50565b5f8151905061042881610404565b92915050565b5f5f5f5f5f60a086880312156104475761044661032f565b5b5f6104548882890161038a565b9550506020610465888289016103b4565b9450506040610476888289016103e7565b9350506060610487888289016103e7565b92505060806104988882890161041a565b9150509295509295909350565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602160045260245ffd5b60805160a05160c05160e05161010051611e0561055c5f395f610b7e01525f81816104d50152818161061901526109df01525f81816106cb015281816106f7015281816108af01528181610ba201528181610d700152610dd101525f818161039c015281816103fb01528181610a1a0152610c9401525f81816103c0015261072d0152611e055ff3fe608060405234801561000f575f5ffd5b5060043610610109575f3560e01c80636b902cf5116100a0578063a9961c941161006f578063a9961c94146102a5578063c19d93fb146102d5578063c6c0572d146102f3578063d8f7a0bb14610323578063dabc4d511461033f57610109565b80636b902cf51461020957806370bb640f146102275780637ee35a0c1461024557806390509d441461027557610109565b80633171b624116100dc5780633171b624146101955780633197cbb6146101b157806362d73eb8146101cf5780636389e107146101d957610109565b806306dd84851461010d5780630a0090971461013d5780632b7ac3f31461015b5780632f23aaa714610179575b5f5ffd5b610127600480360381019061012291906112c1565b61036f565b604051610134919061130e565b60405180910390f35b61014561039a565b6040516101529190611366565b60405180910390f35b6101636103be565b60405161017091906113da565b60405180910390f35b610193600480360381019061018e9190611454565b6103e2565b005b6101af60048036038101906101aa91906114c0565b6105ab565b005b6101b96109dd565b6040516101c6919061130e565b60405180910390f35b6101d7610a01565b005b6101f360048036038101906101ee9190611532565b610b60565b604051610200919061130e565b60405180910390f35b610211610b7c565b60405161021e9190611575565b60405180910390f35b61022f610ba0565b60405161023c919061130e565b60405180910390f35b61025f600480360381019061025a9190611532565b610bc4565b60405161026c919061130e565b60405180910390f35b61028f600480360381019061028a91906112c1565b610bdf565b60405161029c91906115a8565b60405180910390f35b6102bf60048036038101906102ba9190611532565b610c0a565b6040516102cc9190611366565b60405180910390f35b6102dd610c43565b6040516102ea9190611634565b60405180910390f35b61030d60048036038101906103089190611532565b610c55565b60405161031a91906115a8565b60405180910390f35b61033d60048036038101906103389190611532565b610c7b565b005b61035960048036038101906103549190611532565b610dfa565b604051610366919061130e565b60405180910390f35b5f610392825f5f8681526020019081526020015f20610e1a90919063ffffffff16565b905092915050565b7f000000000000000000000000000000000000000000000000000000000000000081565b7f000000000000000000000000000000000000000000000000000000000000000081565b3373ffffffffffffffffffffffffffffffffffffffff167f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1614610467576040517f38b0578600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6001600281111561047b5761047a6115c1565b5b60035f9054906101000a900460ff16600281111561049c5761049b6115c1565b5b146104d3576040517f573bd23e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000042101561052d576040517f16b7711400000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600260035f6101000a81548160ff02191690836002811115610552576105516115c1565b5b02179055503373ffffffffffffffffffffffffffffffffffffffff167fe1c2e147700bc44992019e412741318d839b68884b3e58d11352ce26c82746f4838360405161059f9291906116a7565b60405180910390a25050565b600160028111156105bf576105be6115c1565b5b60035f9054906101000a900460ff1660028111156105e0576105df6115c1565b5b14610617576040517f573bd23e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b7f00000000000000000000000000000000000000000000000000000000000000004210610670576040517f9dc6741000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b60045f8381526020019081526020015f205f9054906101000a900460ff16156106c5576040517f208b15e800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f6106ef7f0000000000000000000000000000000000000000000000000000000000000000610b60565b90505f61071b7f0000000000000000000000000000000000000000000000000000000000000000610dfa565b90505f6107288787610e8f565b90505f7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663a23f01996040518060400160405280885f60088110610785576107846116c9565b5b60200201358152602001886001600881106107a3576107a26116c9565b5b6020020135815250604051806040016040528060405180604001604052808b6002600881106107d5576107d46116c9565b5b602002013581526020018b6003600881106107f3576107f26116c9565b5b6020020135815250815260200160405180604001604052808b60046008811061081f5761081e6116c9565b5b602002013581526020018b60056008811061083d5761083c6116c9565b5b602002013581525081525060405180604001604052808a600660088110610867576108666116c9565b5b602002013581526020018a600760088110610885576108846116c9565b5b602002013581525060405180608001604052808981526020018c81526020018881526020016108d37f0000000000000000000000000000000000000000000000000000000000000000610eb6565b815250896040518663ffffffff1660e01b81526004016108f7959493929190611910565b602060405180830381865afa158015610912573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610936919061198e565b90508061096f576040517f4aa6bc4000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600160045f8881526020019081526020015f205f6101000a81548160ff0219169083151502179055507f16c0cfbb4df78e033836c442531004acbf956758434ec8258a00acec7d6574ac8888886040516109cb939291906119b9565b60405180910390a15050505050505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b3373ffffffffffffffffffffffffffffffffffffffff167f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1614610a86576040517f38b0578600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f6002811115610a9957610a986115c1565b5b60035f9054906101000a900460ff166002811115610aba57610ab96115c1565b5b14610af1576040517fc0a2ec7000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b600160035f6101000a81548160ff02191690836002811115610b1657610b156115c1565b5b02179055503373ffffffffffffffffffffffffffffffffffffffff167feef65e76a64fc102fbb038122ca40a3e13a4edec94c993d74e4ed2bf2f66e0d660405160405180910390a2565b5f5f5f8381526020019081526020015f20600101549050919050565b7f000000000000000000000000000000000000000000000000000000000000000081565b7f000000000000000000000000000000000000000000000000000000000000000081565b5f5f5f8381526020019081526020015f205f01549050919050565b5f610c02825f5f8681526020019081526020015f20610eeb90919063ffffffff16565b905092915050565b5f60015f8381526020019081526020015f205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b60035f9054906101000a900460ff1681565b5f60045f8381526020019081526020015f205f9054906101000a900460ff169050919050565b3373ffffffffffffffffffffffffffffffffffffffff167f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1614610d00576040517f38b0578600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f6002811115610d1357610d126115c1565b5b60035f9054906101000a900460ff166002811115610d3457610d336115c1565b5b14610d6b576040517fc0a2ec7000000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610d957f000000000000000000000000000000000000000000000000000000000000000082610bdf565b15610dcc576040517fd1feb3c600000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b610df67f000000000000000000000000000000000000000000000000000000000000000082610f0b565b5050565b5f610e135f5f8481526020019081526020015f20611016565b9050919050565b5f5f836003015f8481526020019081526020015f205403610e67576040517f7204756c00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6001836003015f8481526020019081526020015f2054610e879190611a16565b905092915050565b5f60088383604051610ea2929190611a77565b60405180910390205f1c901c905092915050565b5f600882604051602001610eca9190611aaf565b604051602081830303815290604052805190602001205f1c901c9050919050565b5f5f836003015f8481526020019081526020015f20541415905092915050565b5f823373ffffffffffffffffffffffffffffffffffffffff1660015f8381526020019081526020015f205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610fa2576040517fbb9bf27800000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f610fac85610bc4565b9050610fd0845f5f8881526020019081526020015f2061103690919063ffffffff16565b9250847f19239b3f93cd10558aaf11423af70c77763bf54f52bcc75bfa74d4d13548cde982868660405161100693929190611ac9565b60405180910390a2505092915050565b5f816002015f836001015481526020019081526020015f20549050919050565b5f7f30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f00000018210611090576040517fc380a82e00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f82036110c9576040517f29691be200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6110d38383610eeb565b1561110a576040517f258a195a00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5f835f015490505f846001015490506001826111269190611afe565b8160026111339190611c60565b1015611146578061114390611caa565b90505b8085600101819055505f8490505f5f90505b82811015611235576001808286901c16036112115773__$078c82ddf6c95d34ea184ef1dd6130d136$__63561558fe60405180604001604052808a6002015f8681526020019081526020015f20548152602001858152506040518263ffffffff1660e01b81526004016111cb9190611d77565b602060405180830381865af41580156111e6573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061120a9190611da4565b915061122a565b81876002015f8381526020019081526020015f20819055505b806001019050611158565b508261124090611caa565b925082865f018190555080866002015f8481526020019081526020015f208190555082866003015f8781526020019081526020015f208190555080935050505092915050565b5f5ffd5b5f5ffd5b5f819050919050565b6112a08161128e565b81146112aa575f5ffd5b50565b5f813590506112bb81611297565b92915050565b5f5f604083850312156112d7576112d6611286565b5b5f6112e4858286016112ad565b92505060206112f5858286016112ad565b9150509250929050565b6113088161128e565b82525050565b5f6020820190506113215f8301846112ff565b92915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61135082611327565b9050919050565b61136081611346565b82525050565b5f6020820190506113795f830184611357565b92915050565b5f819050919050565b5f6113a261139d61139884611327565b61137f565b611327565b9050919050565b5f6113b382611388565b9050919050565b5f6113c4826113a9565b9050919050565b6113d4816113ba565b82525050565b5f6020820190506113ed5f8301846113cb565b92915050565b5f5ffd5b5f5ffd5b5f5ffd5b5f5f83601f840112611414576114136113f3565b5b8235905067ffffffffffffffff811115611431576114306113f7565b5b60208301915083600182028301111561144d5761144c6113fb565b5b9250929050565b5f5f6020838503121561146a57611469611286565b5b5f83013567ffffffffffffffff8111156114875761148661128a565b5b611493858286016113ff565b92509250509250929050565b5f819050826020600802820111156114ba576114b96113fb565b5b92915050565b5f5f5f5f61014085870312156114d9576114d8611286565b5b5f85013567ffffffffffffffff8111156114f6576114f561128a565b5b611502878288016113ff565b94509450506020611515878288016112ad565b92505060406115268782880161149f565b91505092959194509250565b5f6020828403121561154757611546611286565b5b5f611554848285016112ad565b91505092915050565b5f819050919050565b61156f8161155d565b82525050565b5f6020820190506115885f830184611566565b92915050565b5f8115159050919050565b6115a28161158e565b82525050565b5f6020820190506115bb5f830184611599565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602160045260245ffd5b600381106115ff576115fe6115c1565b5b50565b5f81905061160f826115ee565b919050565b5f61161e82611602565b9050919050565b61162e81611614565b82525050565b5f6020820190506116475f830184611625565b92915050565b5f82825260208201905092915050565b828183375f83830152505050565b5f601f19601f8301169050919050565b5f611686838561164d565b935061169383858461165d565b61169c8361166b565b840190509392505050565b5f6020820190508181035f8301526116c081848661167b565b90509392505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603260045260245ffd5b5f60029050919050565b5f81905092915050565b5f819050919050565b61171c8161128e565b82525050565b5f61172d8383611713565b60208301905092915050565b5f602082019050919050565b61174e816116f6565b6117588184611700565b92506117638261170a565b805f5b8381101561179357815161177a8782611722565b965061178583611739565b925050600181019050611766565b505050505050565b5f60029050919050565b5f81905092915050565b5f819050919050565b5f81905092915050565b6117cb816116f6565b6117d581846117b8565b92506117e08261170a565b805f5b838110156118105781516117f78782611722565b965061180283611739565b9250506001810190506117e3565b505050505050565b5f61182383836117c2565b60408301905092915050565b5f602082019050919050565b6118448161179b565b61184e81846117a5565b9250611859826117af565b805f5b838110156118895781516118708782611818565b965061187b8361182f565b92505060018101905061185c565b505050505050565b5f60049050919050565b5f81905092915050565b5f819050919050565b5f602082019050919050565b6118c381611891565b6118cd818461189b565b92506118d8826118a5565b805f5b838110156119085781516118ef8782611722565b96506118fa836118ae565b9250506001810190506118db565b505050505050565b5f6101a0820190506119245f830188611745565b611931604083018761183b565b61193e60c0830186611745565b61194c6101008301856118ba565b61195a6101808301846112ff565b9695505050505050565b61196d8161158e565b8114611977575f5ffd5b50565b5f8151905061198881611964565b92915050565b5f602082840312156119a3576119a2611286565b5b5f6119b08482850161197a565b91505092915050565b5f6040820190508181035f8301526119d281858761167b565b90506119e160208301846112ff565b949350505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f611a208261128e565b9150611a2b8361128e565b9250828203905081811115611a4357611a426119e9565b5b92915050565b5f81905092915050565b5f611a5e8385611a49565b9350611a6b83858461165d565b82840190509392505050565b5f611a83828486611a53565b91508190509392505050565b5f819050919050565b611aa9611aa48261128e565b611a8f565b82525050565b5f611aba8284611a98565b60208201915081905092915050565b5f606082019050611adc5f8301866112ff565b611ae960208301856112ff565b611af660408301846112ff565b949350505050565b5f611b088261128e565b9150611b138361128e565b9250828201905080821115611b2b57611b2a6119e9565b5b92915050565b5f8160011c9050919050565b5f5f8291508390505b6001851115611b8657808604811115611b6257611b616119e9565b5b6001851615611b715780820291505b8081029050611b7f85611b31565b9450611b46565b94509492505050565b5f82611b9e5760019050611c59565b81611bab575f9050611c59565b8160018114611bc15760028114611bcb57611bfa565b6001915050611c59565b60ff841115611bdd57611bdc6119e9565b5b8360020a915084821115611bf457611bf36119e9565b5b50611c59565b5060208310610133831016604e8410600b8410161715611c2f5782820a905083811115611c2a57611c296119e9565b5b611c59565b611c3c8484846001611b3d565b92509050818404811115611c5357611c526119e9565b5b81810290505b9392505050565b5f611c6a8261128e565b9150611c758361128e565b9250611ca27fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8484611b8f565b905092915050565b5f611cb48261128e565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8203611ce657611ce56119e9565b5b600182019050919050565b5f81905092915050565b611d048161128e565b82525050565b5f611d158383611cfb565b60208301905092915050565b611d2a816116f6565b611d348184611cf1565b9250611d3f8261170a565b805f5b83811015611d6f578151611d568782611d0a565b9650611d6183611739565b925050600181019050611d42565b505050505050565b5f604082019050611d8a5f830184611d21565b92915050565b5f81519050611d9e81611297565b92915050565b5f60208284031215611db957611db8611286565b5b5f611dc684828501611d90565b9150509291505056fea2646970667358221220fa83c4077f35dd3dbee481e1732a142f5a2561889623144c5a2477a2f207d93964736f6c634300081c0033";

    private static String librariesLinkedBinary;

    public static final String FUNC_ADDVOTER = "addVoter";

    public static final String FUNC_CASTVOTE = "castVote";

    public static final String FUNC_COORDINATOR = "coordinator";

    public static final String FUNC_ENCRYPTIONPUBLICKEY = "encryptionPublicKey";

    public static final String FUNC_ENDELECTION = "endElection";

    public static final String FUNC_ENDTIME = "endTime";

    public static final String FUNC_EXTERNALNULLIFIER = "externalNullifier";

    public static final String FUNC_GETGROUPADMIN = "getGroupAdmin";

    public static final String FUNC_GETMERKLETREEDEPTH = "getMerkleTreeDepth";

    public static final String FUNC_GETMERKLETREEROOT = "getMerkleTreeRoot";

    public static final String FUNC_GETMERKLETREESIZE = "getMerkleTreeSize";

    public static final String FUNC_HASMEMBER = "hasMember";

    public static final String FUNC_INDEXOF = "indexOf";

    public static final String FUNC_ISNULLIFIERUSED = "isNullifierUsed";

    public static final String FUNC_STARTELECTION = "startElection";

    public static final String FUNC_STATE = "state";

    public static final String FUNC_VERIFIER = "verifier";

    public static final CustomError LEAFALREADYEXISTS_ERROR = new CustomError("LeafAlreadyExists", 
            Arrays.<TypeReference<?>>asList());
    ;

    public static final CustomError LEAFCANNOTBEZERO_ERROR = new CustomError("LeafCannotBeZero", 
            Arrays.<TypeReference<?>>asList());
    ;

    public static final CustomError LEAFDOESNOTEXIST_ERROR = new CustomError("LeafDoesNotExist", 
            Arrays.<TypeReference<?>>asList());
    ;

    public static final CustomError LEAFGREATERTHANSNARKSCALARFIELD_ERROR = new CustomError("LeafGreaterThanSnarkScalarField", 
            Arrays.<TypeReference<?>>asList());
    ;

    public static final CustomError SEMAPHORE__CALLERISNOTTHEELECTIONCOORDINATOR_ERROR = new CustomError("Semaphore__CallerIsNotTheElectionCoordinator", 
            Arrays.<TypeReference<?>>asList());
    ;

    public static final CustomError SEMAPHORE__CALLERISNOTTHEGROUPADMIN_ERROR = new CustomError("Semaphore__CallerIsNotTheGroupAdmin", 
            Arrays.<TypeReference<?>>asList());
    ;

    public static final CustomError SEMAPHORE__CALLERISNOTTHEPENDINGGROUPADMIN_ERROR = new CustomError("Semaphore__CallerIsNotThePendingGroupAdmin", 
            Arrays.<TypeReference<?>>asList());
    ;

    public static final CustomError SEMAPHORE__ELECTIONHASALREADYBEENSTARTED_ERROR = new CustomError("Semaphore__ElectionHasAlreadyBeenStarted", 
            Arrays.<TypeReference<?>>asList());
    ;

    public static final CustomError SEMAPHORE__ELECTIONHASENDED_ERROR = new CustomError("Semaphore__ElectionHasEnded", 
            Arrays.<TypeReference<?>>asList());
    ;

    public static final CustomError SEMAPHORE__ELECTIONHASNOTENDEDYET_ERROR = new CustomError("Semaphore__ElectionHasNotEndedYet", 
            Arrays.<TypeReference<?>>asList());
    ;

    public static final CustomError SEMAPHORE__ELECTIONISNOTONGOING_ERROR = new CustomError("Semaphore__ElectionIsNotOngoing", 
            Arrays.<TypeReference<?>>asList());
    ;

    public static final CustomError SEMAPHORE__GROUPDOESNOTEXIST_ERROR = new CustomError("Semaphore__GroupDoesNotExist", 
            Arrays.<TypeReference<?>>asList());
    ;

    public static final CustomError SEMAPHORE__INVALIDCOORDINATOR_ERROR = new CustomError("Semaphore__InvalidCoordinator", 
            Arrays.<TypeReference<?>>asList());
    ;

    public static final CustomError SEMAPHORE__INVALIDCOORDINATORPUBLICKEY_ERROR = new CustomError("Semaphore__InvalidCoordinatorPublicKey", 
            Arrays.<TypeReference<?>>asList());
    ;

    public static final CustomError SEMAPHORE__INVALIDENDTIME_ERROR = new CustomError("Semaphore__InvalidEndTime", 
            Arrays.<TypeReference<?>>asList());
    ;

    public static final CustomError SEMAPHORE__INVALIDEXTERNALNULLIFIER_ERROR = new CustomError("Semaphore__InvalidExternalNullifier", 
            Arrays.<TypeReference<?>>asList());
    ;

    public static final CustomError SEMAPHORE__INVALIDPROOF_ERROR = new CustomError("Semaphore__InvalidProof", 
            Arrays.<TypeReference<?>>asList());
    ;

    public static final CustomError SEMAPHORE__INVALIDVERIFIER_ERROR = new CustomError("Semaphore__InvalidVerifier", 
            Arrays.<TypeReference<?>>asList());
    ;

    public static final CustomError SEMAPHORE__MEMBERALREADYEXISTS_ERROR = new CustomError("Semaphore__MemberAlreadyExists", 
            Arrays.<TypeReference<?>>asList());
    ;

    public static final CustomError SEMAPHORE__YOUAREUSINGTHESAMENULLIFIERTWICE_ERROR = new CustomError("Semaphore__YouAreUsingTheSameNullifierTwice", 
            Arrays.<TypeReference<?>>asList());
    ;

    public static final Event ELECTIONENDED_EVENT = new Event("ElectionEnded", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Address>(true) {}, new TypeReference<DynamicBytes>() {}));
    ;

    public static final Event ELECTIONSTARTED_EVENT = new Event("ElectionStarted", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Address>(true) {}));
    ;

    public static final Event GROUPADMINPENDING_EVENT = new Event("GroupAdminPending", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>(true) {}, new TypeReference<Address>(true) {}, new TypeReference<Address>(true) {}));
    ;

    public static final Event GROUPADMINUPDATED_EVENT = new Event("GroupAdminUpdated", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>(true) {}, new TypeReference<Address>(true) {}, new TypeReference<Address>(true) {}));
    ;

    public static final Event GROUPCREATED_EVENT = new Event("GroupCreated", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>(true) {}));
    ;

    public static final Event MEMBERADDED_EVENT = new Event("MemberAdded", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>(true) {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}));
    ;

    public static final Event MEMBERREMOVED_EVENT = new Event("MemberRemoved", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>(true) {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}));
    ;

    public static final Event MEMBERUPDATED_EVENT = new Event("MemberUpdated", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>(true) {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}, new TypeReference<Uint256>() {}));
    ;

    public static final Event MEMBERSADDED_EVENT = new Event("MembersAdded", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>(true) {}, new TypeReference<Uint256>() {}, new TypeReference<DynamicArray<Uint256>>() {}, new TypeReference<Uint256>() {}));
    ;

    public static final Event VOTEADDED_EVENT = new Event("VoteAdded", 
            Arrays.<TypeReference<?>>asList(new TypeReference<DynamicBytes>() {}, new TypeReference<Uint256>() {}));
    ;

    protected static final HashMap<String, String> _addresses;

    static {
        _addresses = new HashMap<String, String>();
    }

    @Deprecated
    protected Election(String contractAddress, Web3j web3j, Credentials credentials,
            BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected Election(String contractAddress, Web3j web3j, Credentials credentials,
            ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    @Deprecated
    protected Election(String contractAddress, Web3j web3j, TransactionManager transactionManager,
            BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected Election(String contractAddress, Web3j web3j, TransactionManager transactionManager,
            ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static List<ElectionEndedEventResponse> getElectionEndedEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(ELECTIONENDED_EVENT, transactionReceipt);
        ArrayList<ElectionEndedEventResponse> responses = new ArrayList<ElectionEndedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            ElectionEndedEventResponse typedResponse = new ElectionEndedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.coordinator = (String) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.decryptionKey = (byte[]) eventValues.getNonIndexedValues().get(0).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static ElectionEndedEventResponse getElectionEndedEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(ELECTIONENDED_EVENT, log);
        ElectionEndedEventResponse typedResponse = new ElectionEndedEventResponse();
        typedResponse.log = log;
        typedResponse.coordinator = (String) eventValues.getIndexedValues().get(0).getValue();
        typedResponse.decryptionKey = (byte[]) eventValues.getNonIndexedValues().get(0).getValue();
        return typedResponse;
    }

    public Flowable<ElectionEndedEventResponse> electionEndedEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getElectionEndedEventFromLog(log));
    }

    public Flowable<ElectionEndedEventResponse> electionEndedEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(ELECTIONENDED_EVENT));
        return electionEndedEventFlowable(filter);
    }

    public static List<ElectionStartedEventResponse> getElectionStartedEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(ELECTIONSTARTED_EVENT, transactionReceipt);
        ArrayList<ElectionStartedEventResponse> responses = new ArrayList<ElectionStartedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            ElectionStartedEventResponse typedResponse = new ElectionStartedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.coordinator = (String) eventValues.getIndexedValues().get(0).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static ElectionStartedEventResponse getElectionStartedEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(ELECTIONSTARTED_EVENT, log);
        ElectionStartedEventResponse typedResponse = new ElectionStartedEventResponse();
        typedResponse.log = log;
        typedResponse.coordinator = (String) eventValues.getIndexedValues().get(0).getValue();
        return typedResponse;
    }

    public Flowable<ElectionStartedEventResponse> electionStartedEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getElectionStartedEventFromLog(log));
    }

    public Flowable<ElectionStartedEventResponse> electionStartedEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(ELECTIONSTARTED_EVENT));
        return electionStartedEventFlowable(filter);
    }

    public static List<GroupAdminPendingEventResponse> getGroupAdminPendingEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(GROUPADMINPENDING_EVENT, transactionReceipt);
        ArrayList<GroupAdminPendingEventResponse> responses = new ArrayList<GroupAdminPendingEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            GroupAdminPendingEventResponse typedResponse = new GroupAdminPendingEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.groupId = (BigInteger) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.oldAdmin = (String) eventValues.getIndexedValues().get(1).getValue();
            typedResponse.newAdmin = (String) eventValues.getIndexedValues().get(2).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static GroupAdminPendingEventResponse getGroupAdminPendingEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(GROUPADMINPENDING_EVENT, log);
        GroupAdminPendingEventResponse typedResponse = new GroupAdminPendingEventResponse();
        typedResponse.log = log;
        typedResponse.groupId = (BigInteger) eventValues.getIndexedValues().get(0).getValue();
        typedResponse.oldAdmin = (String) eventValues.getIndexedValues().get(1).getValue();
        typedResponse.newAdmin = (String) eventValues.getIndexedValues().get(2).getValue();
        return typedResponse;
    }

    public Flowable<GroupAdminPendingEventResponse> groupAdminPendingEventFlowable(
            EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getGroupAdminPendingEventFromLog(log));
    }

    public Flowable<GroupAdminPendingEventResponse> groupAdminPendingEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(GROUPADMINPENDING_EVENT));
        return groupAdminPendingEventFlowable(filter);
    }

    public static List<GroupAdminUpdatedEventResponse> getGroupAdminUpdatedEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(GROUPADMINUPDATED_EVENT, transactionReceipt);
        ArrayList<GroupAdminUpdatedEventResponse> responses = new ArrayList<GroupAdminUpdatedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            GroupAdminUpdatedEventResponse typedResponse = new GroupAdminUpdatedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.groupId = (BigInteger) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.oldAdmin = (String) eventValues.getIndexedValues().get(1).getValue();
            typedResponse.newAdmin = (String) eventValues.getIndexedValues().get(2).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static GroupAdminUpdatedEventResponse getGroupAdminUpdatedEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(GROUPADMINUPDATED_EVENT, log);
        GroupAdminUpdatedEventResponse typedResponse = new GroupAdminUpdatedEventResponse();
        typedResponse.log = log;
        typedResponse.groupId = (BigInteger) eventValues.getIndexedValues().get(0).getValue();
        typedResponse.oldAdmin = (String) eventValues.getIndexedValues().get(1).getValue();
        typedResponse.newAdmin = (String) eventValues.getIndexedValues().get(2).getValue();
        return typedResponse;
    }

    public Flowable<GroupAdminUpdatedEventResponse> groupAdminUpdatedEventFlowable(
            EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getGroupAdminUpdatedEventFromLog(log));
    }

    public Flowable<GroupAdminUpdatedEventResponse> groupAdminUpdatedEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(GROUPADMINUPDATED_EVENT));
        return groupAdminUpdatedEventFlowable(filter);
    }

    public static List<GroupCreatedEventResponse> getGroupCreatedEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(GROUPCREATED_EVENT, transactionReceipt);
        ArrayList<GroupCreatedEventResponse> responses = new ArrayList<GroupCreatedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            GroupCreatedEventResponse typedResponse = new GroupCreatedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.groupId = (BigInteger) eventValues.getIndexedValues().get(0).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static GroupCreatedEventResponse getGroupCreatedEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(GROUPCREATED_EVENT, log);
        GroupCreatedEventResponse typedResponse = new GroupCreatedEventResponse();
        typedResponse.log = log;
        typedResponse.groupId = (BigInteger) eventValues.getIndexedValues().get(0).getValue();
        return typedResponse;
    }

    public Flowable<GroupCreatedEventResponse> groupCreatedEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getGroupCreatedEventFromLog(log));
    }

    public Flowable<GroupCreatedEventResponse> groupCreatedEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(GROUPCREATED_EVENT));
        return groupCreatedEventFlowable(filter);
    }

    public static List<MemberAddedEventResponse> getMemberAddedEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(MEMBERADDED_EVENT, transactionReceipt);
        ArrayList<MemberAddedEventResponse> responses = new ArrayList<MemberAddedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            MemberAddedEventResponse typedResponse = new MemberAddedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.groupId = (BigInteger) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.index = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
            typedResponse.identityCommitment = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
            typedResponse.merkleTreeRoot = (BigInteger) eventValues.getNonIndexedValues().get(2).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static MemberAddedEventResponse getMemberAddedEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(MEMBERADDED_EVENT, log);
        MemberAddedEventResponse typedResponse = new MemberAddedEventResponse();
        typedResponse.log = log;
        typedResponse.groupId = (BigInteger) eventValues.getIndexedValues().get(0).getValue();
        typedResponse.index = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
        typedResponse.identityCommitment = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
        typedResponse.merkleTreeRoot = (BigInteger) eventValues.getNonIndexedValues().get(2).getValue();
        return typedResponse;
    }

    public Flowable<MemberAddedEventResponse> memberAddedEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getMemberAddedEventFromLog(log));
    }

    public Flowable<MemberAddedEventResponse> memberAddedEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(MEMBERADDED_EVENT));
        return memberAddedEventFlowable(filter);
    }

    public static List<MemberRemovedEventResponse> getMemberRemovedEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(MEMBERREMOVED_EVENT, transactionReceipt);
        ArrayList<MemberRemovedEventResponse> responses = new ArrayList<MemberRemovedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            MemberRemovedEventResponse typedResponse = new MemberRemovedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.groupId = (BigInteger) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.index = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
            typedResponse.identityCommitment = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
            typedResponse.merkleTreeRoot = (BigInteger) eventValues.getNonIndexedValues().get(2).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static MemberRemovedEventResponse getMemberRemovedEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(MEMBERREMOVED_EVENT, log);
        MemberRemovedEventResponse typedResponse = new MemberRemovedEventResponse();
        typedResponse.log = log;
        typedResponse.groupId = (BigInteger) eventValues.getIndexedValues().get(0).getValue();
        typedResponse.index = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
        typedResponse.identityCommitment = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
        typedResponse.merkleTreeRoot = (BigInteger) eventValues.getNonIndexedValues().get(2).getValue();
        return typedResponse;
    }

    public Flowable<MemberRemovedEventResponse> memberRemovedEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getMemberRemovedEventFromLog(log));
    }

    public Flowable<MemberRemovedEventResponse> memberRemovedEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(MEMBERREMOVED_EVENT));
        return memberRemovedEventFlowable(filter);
    }

    public static List<MemberUpdatedEventResponse> getMemberUpdatedEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(MEMBERUPDATED_EVENT, transactionReceipt);
        ArrayList<MemberUpdatedEventResponse> responses = new ArrayList<MemberUpdatedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            MemberUpdatedEventResponse typedResponse = new MemberUpdatedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.groupId = (BigInteger) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.index = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
            typedResponse.identityCommitment = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
            typedResponse.newIdentityCommitment = (BigInteger) eventValues.getNonIndexedValues().get(2).getValue();
            typedResponse.merkleTreeRoot = (BigInteger) eventValues.getNonIndexedValues().get(3).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static MemberUpdatedEventResponse getMemberUpdatedEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(MEMBERUPDATED_EVENT, log);
        MemberUpdatedEventResponse typedResponse = new MemberUpdatedEventResponse();
        typedResponse.log = log;
        typedResponse.groupId = (BigInteger) eventValues.getIndexedValues().get(0).getValue();
        typedResponse.index = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
        typedResponse.identityCommitment = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
        typedResponse.newIdentityCommitment = (BigInteger) eventValues.getNonIndexedValues().get(2).getValue();
        typedResponse.merkleTreeRoot = (BigInteger) eventValues.getNonIndexedValues().get(3).getValue();
        return typedResponse;
    }

    public Flowable<MemberUpdatedEventResponse> memberUpdatedEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getMemberUpdatedEventFromLog(log));
    }

    public Flowable<MemberUpdatedEventResponse> memberUpdatedEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(MEMBERUPDATED_EVENT));
        return memberUpdatedEventFlowable(filter);
    }

    public static List<MembersAddedEventResponse> getMembersAddedEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(MEMBERSADDED_EVENT, transactionReceipt);
        ArrayList<MembersAddedEventResponse> responses = new ArrayList<MembersAddedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            MembersAddedEventResponse typedResponse = new MembersAddedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.groupId = (BigInteger) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.startIndex = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
            typedResponse.identityCommitments = (List<BigInteger>) ((Array) eventValues.getNonIndexedValues().get(1)).getNativeValueCopy();
            typedResponse.merkleTreeRoot = (BigInteger) eventValues.getNonIndexedValues().get(2).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static MembersAddedEventResponse getMembersAddedEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(MEMBERSADDED_EVENT, log);
        MembersAddedEventResponse typedResponse = new MembersAddedEventResponse();
        typedResponse.log = log;
        typedResponse.groupId = (BigInteger) eventValues.getIndexedValues().get(0).getValue();
        typedResponse.startIndex = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
        typedResponse.identityCommitments = (List<BigInteger>) ((Array) eventValues.getNonIndexedValues().get(1)).getNativeValueCopy();
        typedResponse.merkleTreeRoot = (BigInteger) eventValues.getNonIndexedValues().get(2).getValue();
        return typedResponse;
    }

    public Flowable<MembersAddedEventResponse> membersAddedEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getMembersAddedEventFromLog(log));
    }

    public Flowable<MembersAddedEventResponse> membersAddedEventFlowable(
            DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(MEMBERSADDED_EVENT));
        return membersAddedEventFlowable(filter);
    }

    public static List<VoteAddedEventResponse> getVoteAddedEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(VOTEADDED_EVENT, transactionReceipt);
        ArrayList<VoteAddedEventResponse> responses = new ArrayList<VoteAddedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            VoteAddedEventResponse typedResponse = new VoteAddedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.ciphertext = (byte[]) eventValues.getNonIndexedValues().get(0).getValue();
            typedResponse.nullifierHash = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static VoteAddedEventResponse getVoteAddedEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(VOTEADDED_EVENT, log);
        VoteAddedEventResponse typedResponse = new VoteAddedEventResponse();
        typedResponse.log = log;
        typedResponse.ciphertext = (byte[]) eventValues.getNonIndexedValues().get(0).getValue();
        typedResponse.nullifierHash = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
        return typedResponse;
    }

    public Flowable<VoteAddedEventResponse> voteAddedEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getVoteAddedEventFromLog(log));
    }

    public Flowable<VoteAddedEventResponse> voteAddedEventFlowable(DefaultBlockParameter startBlock,
            DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(VOTEADDED_EVENT));
        return voteAddedEventFlowable(filter);
    }

    public RemoteFunctionCall<TransactionReceipt> addVoter(BigInteger identityCommitment) {
        final Function function = new Function(
                FUNC_ADDVOTER, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(identityCommitment)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<TransactionReceipt> castVote(byte[] ciphertext,
            BigInteger nullifierHash, List<BigInteger> proof) {
        final Function function = new Function(
                FUNC_CASTVOTE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.DynamicBytes(ciphertext), 
                new org.web3j.abi.datatypes.generated.Uint256(nullifierHash), 
                new org.web3j.abi.datatypes.generated.StaticArray8<org.web3j.abi.datatypes.generated.Uint256>(
                        org.web3j.abi.datatypes.generated.Uint256.class,
                        org.web3j.abi.Utils.typeMap(proof, org.web3j.abi.datatypes.generated.Uint256.class))), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<String> coordinator() {
        final Function function = new Function(FUNC_COORDINATOR, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<byte[]> encryptionPublicKey() {
        final Function function = new Function(FUNC_ENCRYPTIONPUBLICKEY, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bytes32>() {}));
        return executeRemoteCallSingleValueReturn(function, byte[].class);
    }

    public RemoteFunctionCall<TransactionReceipt> endElection(byte[] decryptionKey) {
        final Function function = new Function(
                FUNC_ENDELECTION, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.DynamicBytes(decryptionKey)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<BigInteger> endTime() {
        final Function function = new Function(FUNC_ENDTIME, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteFunctionCall<BigInteger> externalNullifier() {
        final Function function = new Function(FUNC_EXTERNALNULLIFIER, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteFunctionCall<String> getGroupAdmin(BigInteger groupId) {
        final Function function = new Function(FUNC_GETGROUPADMIN, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(groupId)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteFunctionCall<BigInteger> getMerkleTreeDepth(BigInteger groupId) {
        final Function function = new Function(FUNC_GETMERKLETREEDEPTH, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(groupId)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteFunctionCall<BigInteger> getMerkleTreeRoot(BigInteger groupId) {
        final Function function = new Function(FUNC_GETMERKLETREEROOT, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(groupId)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteFunctionCall<BigInteger> getMerkleTreeSize(BigInteger groupId) {
        final Function function = new Function(FUNC_GETMERKLETREESIZE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(groupId)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteFunctionCall<Boolean> hasMember(BigInteger groupId,
            BigInteger identityCommitment) {
        final Function function = new Function(FUNC_HASMEMBER, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(groupId), 
                new org.web3j.abi.datatypes.generated.Uint256(identityCommitment)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bool>() {}));
        return executeRemoteCallSingleValueReturn(function, Boolean.class);
    }

    public RemoteFunctionCall<BigInteger> indexOf(BigInteger groupId,
            BigInteger identityCommitment) {
        final Function function = new Function(FUNC_INDEXOF, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(groupId), 
                new org.web3j.abi.datatypes.generated.Uint256(identityCommitment)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteFunctionCall<Boolean> isNullifierUsed(BigInteger nullifierHash) {
        final Function function = new Function(FUNC_ISNULLIFIERUSED, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(nullifierHash)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bool>() {}));
        return executeRemoteCallSingleValueReturn(function, Boolean.class);
    }

    public RemoteFunctionCall<TransactionReceipt> startElection() {
        final Function function = new Function(
                FUNC_STARTELECTION, 
                Arrays.<Type>asList(), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<BigInteger> state() {
        final Function function = new Function(FUNC_STATE, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint8>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteFunctionCall<String> verifier() {
        final Function function = new Function(FUNC_VERIFIER, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    @Deprecated
    public static Election load(String contractAddress, Web3j web3j, Credentials credentials,
            BigInteger gasPrice, BigInteger gasLimit) {
        return new Election(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    @Deprecated
    public static Election load(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new Election(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static Election load(String contractAddress, Web3j web3j, Credentials credentials,
            ContractGasProvider contractGasProvider) {
        return new Election(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static Election load(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return new Election(contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static RemoteCall<Election> deploy(Web3j web3j, Credentials credentials,
            ContractGasProvider contractGasProvider, String _verifier, String _coordinator,
            BigInteger _externalNullifier, BigInteger _endTime, byte[] _encryptionPublicKey) {
        String encodedConstructor = FunctionEncoder.encodeConstructor(Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(_verifier), 
                new org.web3j.abi.datatypes.Address(_coordinator), 
                new org.web3j.abi.datatypes.generated.Uint256(_externalNullifier), 
                new org.web3j.abi.datatypes.generated.Uint256(_endTime), 
                new org.web3j.abi.datatypes.generated.Bytes32(_encryptionPublicKey)));
        return deployRemoteCall(Election.class, web3j, credentials, contractGasProvider, getDeploymentBinary(), encodedConstructor);
    }

    public static RemoteCall<Election> deploy(Web3j web3j, TransactionManager transactionManager,
            ContractGasProvider contractGasProvider, String _verifier, String _coordinator,
            BigInteger _externalNullifier, BigInteger _endTime, byte[] _encryptionPublicKey) {
        String encodedConstructor = FunctionEncoder.encodeConstructor(Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(_verifier), 
                new org.web3j.abi.datatypes.Address(_coordinator), 
                new org.web3j.abi.datatypes.generated.Uint256(_externalNullifier), 
                new org.web3j.abi.datatypes.generated.Uint256(_endTime), 
                new org.web3j.abi.datatypes.generated.Bytes32(_encryptionPublicKey)));
        return deployRemoteCall(Election.class, web3j, transactionManager, contractGasProvider, getDeploymentBinary(), encodedConstructor);
    }

    @Deprecated
    public static RemoteCall<Election> deploy(Web3j web3j, Credentials credentials,
            BigInteger gasPrice, BigInteger gasLimit, String _verifier, String _coordinator,
            BigInteger _externalNullifier, BigInteger _endTime, byte[] _encryptionPublicKey) {
        String encodedConstructor = FunctionEncoder.encodeConstructor(Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(_verifier), 
                new org.web3j.abi.datatypes.Address(_coordinator), 
                new org.web3j.abi.datatypes.generated.Uint256(_externalNullifier), 
                new org.web3j.abi.datatypes.generated.Uint256(_endTime), 
                new org.web3j.abi.datatypes.generated.Bytes32(_encryptionPublicKey)));
        return deployRemoteCall(Election.class, web3j, credentials, gasPrice, gasLimit, getDeploymentBinary(), encodedConstructor);
    }

    @Deprecated
    public static RemoteCall<Election> deploy(Web3j web3j, TransactionManager transactionManager,
            BigInteger gasPrice, BigInteger gasLimit, String _verifier, String _coordinator,
            BigInteger _externalNullifier, BigInteger _endTime, byte[] _encryptionPublicKey) {
        String encodedConstructor = FunctionEncoder.encodeConstructor(Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(_verifier), 
                new org.web3j.abi.datatypes.Address(_coordinator), 
                new org.web3j.abi.datatypes.generated.Uint256(_externalNullifier), 
                new org.web3j.abi.datatypes.generated.Uint256(_endTime), 
                new org.web3j.abi.datatypes.generated.Bytes32(_encryptionPublicKey)));
        return deployRemoteCall(Election.class, web3j, transactionManager, gasPrice, gasLimit, getDeploymentBinary(), encodedConstructor);
    }

    public static void linkLibraries(List<Contract.LinkReference> references) {
        librariesLinkedBinary = linkBinaryWithReferences(BINARY, references);
    }

    private static String getDeploymentBinary() {
        if (librariesLinkedBinary != null) {
            return librariesLinkedBinary;
        } else {
            return BINARY;
        }
    }

    protected String getStaticDeployedAddress(String networkId) {
        return _addresses.get(networkId);
    }

    public static String getPreviouslyDeployedAddress(String networkId) {
        return _addresses.get(networkId);
    }

    public static class ElectionEndedEventResponse extends BaseEventResponse {
        public String coordinator;

        public byte[] decryptionKey;
    }

    public static class ElectionStartedEventResponse extends BaseEventResponse {
        public String coordinator;
    }

    public static class GroupAdminPendingEventResponse extends BaseEventResponse {
        public BigInteger groupId;

        public String oldAdmin;

        public String newAdmin;
    }

    public static class GroupAdminUpdatedEventResponse extends BaseEventResponse {
        public BigInteger groupId;

        public String oldAdmin;

        public String newAdmin;
    }

    public static class GroupCreatedEventResponse extends BaseEventResponse {
        public BigInteger groupId;
    }

    public static class MemberAddedEventResponse extends BaseEventResponse {
        public BigInteger groupId;

        public BigInteger index;

        public BigInteger identityCommitment;

        public BigInteger merkleTreeRoot;
    }

    public static class MemberRemovedEventResponse extends BaseEventResponse {
        public BigInteger groupId;

        public BigInteger index;

        public BigInteger identityCommitment;

        public BigInteger merkleTreeRoot;
    }

    public static class MemberUpdatedEventResponse extends BaseEventResponse {
        public BigInteger groupId;

        public BigInteger index;

        public BigInteger identityCommitment;

        public BigInteger newIdentityCommitment;

        public BigInteger merkleTreeRoot;
    }

    public static class MembersAddedEventResponse extends BaseEventResponse {
        public BigInteger groupId;

        public BigInteger startIndex;

        public List<BigInteger> identityCommitments;

        public BigInteger merkleTreeRoot;
    }

    public static class VoteAddedEventResponse extends BaseEventResponse {
        public byte[] ciphertext;

        public BigInteger nullifierHash;
    }
}
