pragma solidity ^0.4.25;

library strings {
    struct slice {
        uint _len;
        uint _ptr;
    }

    function memcpy(uint dest, uint src, uint len) private pure {
        for (; len >= 32; len -= 32) {
            assembly {
                mstore(dest, mload(src))
            }
            dest += 32;
            src += 32;
        }

        uint mask = 256 ** (32 - len) - 1;
        assembly {
            let srcpart := and(mload(src), not(mask))
            let destpart := and(mload(dest), mask)
            mstore(dest, or(destpart, srcpart))
        }
    }

    function toSlice(string memory self) internal pure returns (slice memory) {
        uint ptr;
        assembly {
            ptr := add(self, 0x20)
        }
        return slice(bytes(self).length, ptr);
    }

    function concat(slice memory self, slice memory other) internal pure returns (string memory) {
        string memory ret = new string(self._len + other._len);
        uint retptr;
        assembly {retptr := add(ret, 32)}
        memcpy(retptr, self._ptr, self._len);
        memcpy(retptr + self._len, other._ptr, other._len);
        return ret;
    }

    function join(slice memory self, slice[] memory parts) internal pure returns (string memory) {
        if (parts.length == 0)
            return "";

        uint length = self._len * (parts.length - 1);
        for (uint i = 0; i < parts.length; i++)
            length += parts[i]._len;

        string memory ret = new string(length);
        uint retptr;
        assembly {retptr := add(ret, 32)}

        for (i = 0; i < parts.length; i++) {
            memcpy(retptr, parts[i]._ptr, parts[i]._len);
            retptr += parts[i]._len;
            if (i < parts.length - 1) {
                memcpy(retptr, self._ptr, self._len);
                retptr += self._len;
            }
        }

        return ret;
    }
}

library SafeMath {

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b);

        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0);
        uint256 c = a / b;

        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a);
        uint256 c = a - b;

        return c;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a);

        return c;
    }
}


library Utils {

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a < b) {
            return a;
        }
        return b;
    }

    function bytes32ToString(bytes32 x) internal pure returns (string) {
        uint charCount = 0;
        bytes memory bytesString = new bytes(32);
        for (uint j = 0; j < 32; j++) {
            byte char = byte(bytes32(uint(x) * 2 ** (8 * j)));
            if (char != 0) {
                bytesString[charCount] = char;
                charCount++;
            } else if (charCount != 0) {
                break;
            }
        }
        bytes memory bytesStringTrimmed = new bytes(charCount);
        for (j = 0; j < charCount; j++) {
            bytesStringTrimmed[j] = bytesString[j];

        }
        return string(bytesStringTrimmed);
    }

    function _stringToBytes(string memory source) internal pure returns (bytes32 result) {
        assembly {
            result := mload(add(source, 32))
        }
    }

    function _stringEq(string a, string b) internal pure returns (bool) {
        if (bytes(a).length != bytes(b).length) {
            return false;
        } else {
            return _stringToBytes(a) == _stringToBytes(b);
        }
    }


    function isContract(address addr) internal view returns (bool) {
        uint size;
        assembly {size := extcodesize(addr)}
        return size > 0;

    }
}

library Last {
    struct List {
        uint256[] indexs;
        uint256[] timestamps;
        uint256[] lastValues;
    }

    function list(List storage self) internal view returns (uint256[]) {
        return self.indexs;
    }

    function contains(List storage self, uint256 id) internal view returns (bool, uint256) {
        for (uint256 i = 0; i < self.indexs.length; i++) {
            if (self.indexs[i] == id) {
                return (true, self.lastValues[i]);
            }
        }
        return (false, 0);
    }

    function allValue(List storage self) internal view returns (uint256 all){
        for (uint256 i = 0; i < self.indexs.length; i++) {
            all += self.lastValues[i];
        }
        return all;
    }

    function clear(List storage self, uint256 id) internal {
        for (uint256 i = 0; i < self.indexs.length; i++) {
            if (self.indexs[i] == id) {
                self.lastValues[i] = 0;
                return;
            }
        }
    }

    function add(List storage self, uint256 id, uint256 timestamp, uint256 value) internal {
        uint256 index;
        uint256 mint;
        for (uint256 i = 0; i < self.indexs.length; i++) {
            if (self.indexs[i] == id) {
                self.timestamps[i] = timestamp;
                self.lastValues[i] = value;
                return;
            }
            if (self.timestamps[i] > mint) {
                mint = self.timestamps[i];
                index = i;
            }
        }

        if (self.indexs.length == 10) {
            self.indexs[index] = id;
            self.timestamps[index] = timestamp;
            self.lastValues[index] = value;
        } else {
            self.indexs.push(id);
            self.timestamps.push(timestamp);
            self.lastValues.push(value);
        }
    }

}

contract Ownable {

    address public owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0));
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}

contract SeroInterface {

    bytes32 private topic_sero_issueToken = 0x3be6bf24d822bcd6f6348f6f5a5c2d3108f04991ee63e80cde49a8c4746a0ef3;
    bytes32 private topic_sero_balanceOf = 0xcf19eb4256453a4e30b6a06d651f1970c223fb6bd1826a28ed861f0e602db9b8;
    bytes32 private topic_sero_send = 0x868bd6629e7c2e3d2ccf7b9968fad79b448e7a2bfb3ee20ed1acbc695c3c8b23;
    bytes32 private topic_sero_currency = 0x7c98e64bd943448b4e24ef8c2cdec7b8b1275970cfe10daf2a9bfa4b04dce905;

    function sero_msg_currency() internal returns (string) {
        bytes memory tmp = new bytes(32);
        bytes32 b32;
        assembly {
            log1(tmp, 0x20, sload(topic_sero_currency_slot))
            b32 := mload(tmp)
        }
        return Utils.bytes32ToString(b32);
    }

    function sero_issueToken(uint256 _total, string memory _currency) internal returns (bool success){
        bytes memory temp = new bytes(64);
        assembly {
            mstore(temp, _currency)
            mstore(add(temp, 0x20), _total)
            log1(temp, 0x40, sload(topic_sero_issueToken_slot))
            success := mload(add(temp, 0x20))
        }
        return;
    }

    function sero_balanceOf(string memory _currency) internal view returns (uint256 amount){
        bytes memory temp = new bytes(32);
        assembly {
            mstore(temp, _currency)
            log1(temp, 0x20, sload(topic_sero_balanceOf_slot))
            amount := mload(temp)
        }
        return;
    }

    function sero_send_token(address _receiver, string memory _currency, uint256 _amount) internal returns (bool success){
        return sero_send(_receiver, _currency, _amount, "", 0);
    }

    function sero_send(address _receiver, string memory _currency, uint256 _amount, string memory _category, bytes32 _ticket) internal returns (bool success){
        bytes memory temp = new bytes(160);
        assembly {
            mstore(temp, _receiver)
            mstore(add(temp, 0x20), _currency)
            mstore(add(temp, 0x40), _amount)
            mstore(add(temp, 0x60), _category)
            mstore(add(temp, 0x80), _ticket)
            log1(temp, 0xa0, sload(topic_sero_send_slot))
            success := mload(add(temp, 0x80))
        }
        return;
    }

}

interface CodeService {

    function encode(uint64 n) external view returns (string);

    function decode(string code) external view returns (uint);
}


contract Alpha is Ownable, SeroInterface {

    using SafeMath for uint256;

    struct SubordinateInfo {
        uint256[] counts;
        uint256[] amounts;
        uint256[] rewards;
        string childsCode;
    }

    struct Investor {
        uint256 id;
        uint256 parentId;

        uint256 totalAmount; //total investment
        uint256 currentShareReward;
        uint256 totalShareReward;

        //investment records
        uint256[] values;
        uint256[] timestamps;
        uint256 returnIndex;

        // uint256[] childs;
        SubordinateInfo subordinateInfo;
    }

    uint256 private constant lockPeriod = 15 * 60;
    uint256 private constant closurePeriod = 30 * 60;

    string private constant SERO_CURRENCY = "SERO";
    uint256 private constant maxAmount = 1e23;
    uint256 private constant minAmount = 5e20;
    uint256 private constant tenThousand = 1e22;

    CodeService private codeService;

    address public marketAddr;
    uint256 public fundAmount;
    uint256 public closureTime;
    Investor[] public investors;
    mapping(address => uint256) public indexs;

    using Last for Last.List;
    Last.List private lastInvestors;

    uint256 private confuse;


    constructor(address _marketAddr, address _codeServiceAddr) public {
        marketAddr = _marketAddr;
        codeService = CodeService(_codeServiceAddr);
        investors.push(Investor({id : 0, parentId : 0, totalAmount : 0, currentShareReward : 0, totalShareReward : 0,
            returnIndex : 0, values : new uint256[](0), timestamps : new uint256[](0), subordinateInfo : SubordinateInfo({counts : new uint256[](0), amounts : new uint256[](0), rewards : new uint256[](0), childsCode : ""})
            }));
    }

    function() public payable {
        require(Utils._stringEq(SERO_CURRENCY, sero_msg_currency()));
        confuse = confuse.add(msg.value);
    }

    function withDrawConfuse(uint256 value) public {
        require(msg.sender == marketAddr);
        require(confuse >= value);
        confuse = confuse.sub(value);
        require(sero_send_token(marketAddr, SERO_CURRENCY, value));
    }

    function registerNode(address addr) public onlyOwner {
        require(!Utils.isContract(addr));
        uint256 index = investors.length;
        indexs[addr] = index;
        investors.push(Investor({id : index, parentId : 0, totalAmount : 0, currentShareReward : 0, totalShareReward : 0,
            returnIndex : 0, values : new uint256[](0), timestamps : new uint256[](0), subordinateInfo : SubordinateInfo({counts : new uint256[](20), amounts : new uint256[](20), rewards : new uint256[](20), childsCode : ""})
            }));
    }


    function info() public view returns (uint256, uint256, uint256, uint256, string) {
        string memory luckyCodes;
        if (closureTime != 0) {
            uint256[] memory list = lastInvestors.list();
            strings.slice[] memory parts = new strings.slice[](list.length);
            for (uint256 i = 0; i < list.length; i++) {
                parts[i] = strings.toSlice(codeService.encode(uint64(list[i])));
            }
            luckyCodes = strings.join(strings.toSlice(" "), parts);
        }

        return (closureTime, sero_balanceOf(SERO_CURRENCY).sub(confuse), fundAmount, investors.length, luckyCodes);
    }

    function details(string memory code) public view returns (string slefCode, string parentCode, uint256 shareAmount, uint256 canWithdraw, uint256[] values, uint256[] timestamps, uint256 returnIndex) {
        require(indexs[msg.sender] != 0);
        Investor storage self = investors[indexs[msg.sender]];
        if (!Utils._stringEq(code, "")) {
            uint256 id = codeService.decode(code);
            require(id > 0 && id < investors.length);

            self = investors[id];
            while (id != indexs[msg.sender]) {
                if (id == 0) {
                    return ("", "", 0, 0, new uint256[](0), new uint256[](0), 0);
                }
                id = investors[id].parentId;
            }
        }

        slefCode = codeService.encode(uint64(self.id));
        parentCode = self.parentId == 0 ? "" : codeService.encode(uint64(self.parentId));
        shareAmount = self.totalShareReward;
        (, canWithdraw,) = canWithdrawCash(self);
        values = self.values;
        timestamps = self.timestamps;
        returnIndex = self.returnIndex;
        return;
    }

    function subordinateInfo() public view returns (string codes, uint256[] counts, uint256[] amounts, uint256[] rewards) {
        uint256 index = indexs[msg.sender];
        require(index != 0);
        SubordinateInfo storage sinfo = investors[index].subordinateInfo;
        codes = sinfo.childsCode;
        counts = sinfo.counts;
        amounts = sinfo.amounts;
        rewards = sinfo.rewards;
        return;
    }

    function withdraw() public {
        require(closureTime == 0 || now > closureTime);
        uint256 index = indexs[msg.sender];
        require(index != 0);
        Investor storage self = investors[index];
        (bool flag, uint256 amount, uint256 returnIndex) = canWithdrawCash(self);
        if (amount == 0) {
            return;
        }
        if (closureTime == 0) {
            if (!flag) {
                closureTime = now + closurePeriod;
                return;
            } else {
                if (returnIndex != self.returnIndex) {
                    self.returnIndex = returnIndex;
                }
                if (self.currentShareReward > 0) {
                    self.totalShareReward = self.totalShareReward.add(self.currentShareReward);
                    self.currentShareReward = 0;
                }
            }
        } else {
            if (closureTime != 0) {
                lastInvestors.clear(index);
            }
        }
        require(sero_send_token(msg.sender, SERO_CURRENCY, amount));
    }

    function canWithdrawCash(Investor storage self) internal view returns (bool flag, uint256 amount, uint256 returnIndex) {
        flag = true;
        uint256 balance = sero_balanceOf(SERO_CURRENCY).sub(confuse);
        if (closureTime != 0 && now > closureTime) {
            (bool lucky, uint256 lastValue) = lastInvestors.contains(self.id);
            if (lucky && lastValue > 0) {
                amount = balance.mul(lastValue).div(lastInvestors.allValue());
            }
        } else {
            if (self.values.length > 0) {
                for (returnIndex = self.returnIndex; returnIndex < self.values.length; returnIndex++) {
                    if ((now - self.timestamps[returnIndex]) < lockPeriod) {
                        break;
                    }
                    uint256 value = self.values[returnIndex];
                    amount = amount.add(value).add(value.mul(15).div(200));
                }
            }
            amount = amount.add(self.currentShareReward);
            if (amount > 0) {
                flag = balance >= fundAmount.add(amount);
            }
        }
        return;
    }

    function calceShareReward(Investor storage ancestor, bool isLayerOne, uint256 childAmount, uint256 childValue) internal view returns (uint256) {
        uint256 ancestorAmount;
        if (ancestor.values.length > 0) {
            for (uint256 i = ancestor.values.length; i > ancestor.returnIndex; i--) {
                if ((now - ancestor.timestamps[i - 1]) >= lockPeriod) {
                    break;
                }
                ancestorAmount = ancestorAmount.add(ancestor.values[i - 1]);
            }
        }
        if (ancestorAmount <= childAmount) {
            return 0;
        } else {
            uint256 validAmount = Utils.min(childValue, ancestorAmount.sub(childAmount));
            if (isLayerOne) {
                return validAmount.mul(75).div(1000);
            } else {
                return validAmount.mul(75).div(10000);
            }
        }
    }


    function register(string memory code) internal {
        require(!Utils.isContract(msg.sender));

        uint256 parentIndex = codeService.decode(code);
        require(parentIndex > 0 && parentIndex < investors.length);

        Investor storage parent = investors[parentIndex];
        uint256 index = investors.length;

        if (parent.subordinateInfo.counts[0] == 0) {
            parent.subordinateInfo.childsCode = codeService.encode(uint64(index));
        } else {
            parent.subordinateInfo.childsCode = strings.concat(
                strings.toSlice(strings.concat(
                    strings.toSlice(parent.subordinateInfo.childsCode),
                    strings.toSlice(" "))),
                strings.toSlice(codeService.encode(uint64(index))));
        }

        indexs[msg.sender] = index;
        investors.push(Investor({id : index, parentId : parentIndex, totalAmount : 0, currentShareReward : 0, totalShareReward : 0,
            returnIndex : 0, values : new uint256[](0), timestamps : new uint256[](0), subordinateInfo : SubordinateInfo({counts : new uint256[](20), amounts : new uint256[](20), rewards : new uint256[](20), childsCode : ""})
            }));
    }

    function reinvestment() public {
        require(closureTime == 0);
        uint256 index = indexs[msg.sender];
        require(index != 0);
        Investor storage self = investors[index];
        (, uint256 amount, uint256 returnIndex) = canWithdrawCash(self);
        if (amount == 0) {
            return;
        }
        if (returnIndex != self.returnIndex) {
            self.returnIndex = returnIndex;
        }
        if (self.currentShareReward > 0) {
            self.totalShareReward = self.totalShareReward.add(self.currentShareReward);
            self.currentShareReward = 0;
        }
        investValue(false, index, amount);
    }

    function invest(string memory code) public payable {
        require(closureTime == 0 || now <= closureTime);
        require(Utils._stringEq(SERO_CURRENCY, sero_msg_currency()));

        uint256 index = indexs[msg.sender];
        bool isNew;
        if (index == 0) {
            require(!Utils._stringEq(code, ""));
            register(code);
            index = indexs[msg.sender];
            isNew = true;
        }
        uint256 value = msg.value;

        investValue(isNew, index, value);
    }

    function investValue(bool isNew, uint256 index, uint256 value) internal returns (bool) {
        require(minAmount <= value && value <= maxAmount);

        Investor storage self = investors[index];
        require(self.totalAmount < maxAmount);
        if (self.totalAmount.add(value) > maxAmount) {
            value = maxAmount.sub(self.totalAmount);
            require(sero_send_token(msg.sender, SERO_CURRENCY, msg.value.sub(value)));
        }

        self.values.push(value);
        self.timestamps.push(now);

        fundAmount = fundAmount.add(value.div(100));
        require(sero_send_token(owner, SERO_CURRENCY, value.div(100)));
        require(sero_send_token(marketAddr, SERO_CURRENCY, value.div(50)));

        if (self.parentId > 0) {
            uint256 selfAmount;
            for (uint256 i = self.values.length - 1; i > self.returnIndex; i--) {
                if ((now - self.timestamps[i - 1]) >= lockPeriod) {
                    break;
                }
                selfAmount = selfAmount.add(self.values[i - 1]);
            }

            Investor storage parent = investors[self.parentId];

            uint256 reward = calceShareReward(parent, true, selfAmount, value);
            if (reward > 0) {
                parent.currentShareReward = parent.currentShareReward.add(reward);
                parent.subordinateInfo.rewards[0] = parent.subordinateInfo.rewards[0].add(reward);
            }

            parent.subordinateInfo.amounts[0] = parent.subordinateInfo.amounts[0].add(value);
            if (isNew) {
                parent.subordinateInfo.counts[0] = parent.subordinateInfo.counts[0] + 1;
            }

            uint256 height = 2;
            uint256 currentId = parent.parentId;

            while (currentId != 0 && height <= 20) {
                Investor storage current = investors[currentId];
                uint256 level = current.subordinateInfo.amounts[0].div(tenThousand);
                if (level >= height) {
                    reward = calceShareReward(current, false, selfAmount, value);
                    if (reward > 0) {
                        current.currentShareReward = current.currentShareReward.add(reward);
                        current.subordinateInfo.rewards[height - 1] = current.subordinateInfo.rewards[height - 1].add(reward);
                    }
                }

                current.subordinateInfo.amounts[height - 1] = current.subordinateInfo.amounts[height - 1].add(value);
                if (isNew) {
                    current.subordinateInfo.counts[height - 1] = current.subordinateInfo.counts[height - 1] + 1;

                }
                height++;
                currentId = current.parentId;
            }
        }

        self.totalAmount = self.totalAmount.add(value);
        lastInvestors.add(index, now, value);
        if (closureTime != 0) {
            closureTime = 0;
        }
        return true;
    }

    function list() public view returns (uint256[]) {
        return lastInvestors.list();
    }
}