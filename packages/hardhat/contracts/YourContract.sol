// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract YourContract {
    // Структура для хранения данных о дипломе
    struct Diploma {
        string institution;
        string degree;
        string major;
        uint256 graduationYear;
    }

    mapping(address => Diploma[]) private diplomas;

    event DiplomaAdded(
        address indexed owner,
        string institution,
        string degree,
        string major,
        uint256 graduationYear
    );

    /**
     * @notice Добавляет диплом в список владельца
     * @param _institution Учебное заведение
     * @param _degree Степень
     * @param _major Специальность
     * @param _graduationYear Год выпуска
     */
    function addDiploma(
        string calldata _institution,
        string calldata _degree,
        string calldata _major,
        uint256 _graduationYear
    ) external {
        diplomas[msg.sender].push(Diploma({
            institution: _institution,
            degree: _degree,
            major: _major,
            graduationYear: _graduationYear
        }));

        emit DiplomaAdded(msg.sender, _institution, _degree, _major, _graduationYear);
    }

    /**
     * @notice Возвращает все дипломы указанного пользователя
     * @param _owner Адрес пользователя
     * @return Массив структур Diploma
     */
    function getDiplomas(address _owner) external view returns (Diploma[] memory) {
        return diplomas[_owner];
    }

    /**
     * @notice Проверяет наличие диплома по ключевым данным
     * @param _owner Адрес владельца диплома
     * @param _institution Учебное заведение
     * @param _degree Степень
     * @param _major Специальность
     * @param _graduationYear Год выпуска
     * @return True, если диплом найден, иначе False
     */
    function hasDiploma(
        address _owner,
        string calldata _institution,
        string calldata _degree,
        string calldata _major,
        uint256 _graduationYear
    ) external view returns (bool) {
        Diploma[] memory userDiplomas = diplomas[_owner];
        bytes32 institutionHash = keccak256(abi.encodePacked(_institution));
        bytes32 degreeHash = keccak256(abi.encodePacked(_degree));
        bytes32 majorHash = keccak256(abi.encodePacked(_major));

        for (uint256 i = 0; i < userDiplomas.length; i++) {
            Diploma memory diploma = userDiplomas[i];
            if (
                keccak256(abi.encodePacked(diploma.institution)) == institutionHash &&
                keccak256(abi.encodePacked(diploma.degree)) == degreeHash &&
                keccak256(abi.encodePacked(diploma.major)) == majorHash &&
                diploma.graduationYear == _graduationYear
            ) {
                return true;
            }
        }
        return false;
    }
}
