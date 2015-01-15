//設定控制器
app.controller('itemController', ['$scope', function($scope) {
    //=====初始化=====
    $scope.output = "";
    //=====附魔=====
    $scope.enchList = [
        {},
        {},
    ];
    //=====監視=====
    $scope.$watch(function() {
        update($scope);
    });
    $scope.$watch('itemColor',function() {
        updateColorSelector($scope);
    });
    //=====動作=====
    //新增附魔
    $scope.addEnch = function () {
        $scope.enchList.push({});
    }; 
    //移除附魔
    $scope.removeEnch = function ($index) {
        $scope.enchList.splice($index,1);
    };
    //=====資料=====
    $scope.enchData = [
        {name:"ARROW_DAMAGE",showName:"強力(弓)"},
        {name:"ARROW_FIRE",showName:"火焰(弓)"},
        {name:"ARROW_KNOCKBACK",showName:"擊退(弓)"},
        {name:"ARROW_INFINITE",showName:"無限(弓)"},
        {name:"DAMAGE_ALL",showName:"鋒利"},
        {name:"DAMAGE_ARTHROPODS",showName:"節肢剋星"},
        {name:"DAMAGE_UNDEAD",showName:"不死剋星"},
        {name:"DIG_SPEED",showName:"效率"},
        {name:"DURABILITY",showName:"耐久"},
        {name:"FIRE_ASPECT",showName:"燃燒"},
        {name:"KNOCKBACK",showName:"擊退"},
        {name:"LOOT_BONUS_BLOCKS",showName:"幸運"},
        {name:"LOOT_BONUS_MOBS",showName:"掠奪"},
        {name:"OXYGEN",showName:"水中呼吸"},
        {name:"PROTECTION_ENVIRONMENTAL",showName:"保護"},
        {name:"PROTECTION_FALL",showName:"輕盈"},
        {name:"PROTECTION_FIRE",showName:"抗火性"},
        {name:"PROTECTION_PROJECTILE",showName:"防彈"},
        {name:"PROTECTION_EXPLOSIONS",showName:"防爆"},
        {name:"SILK_TOUCH",showName:"絲綢之觸"},
        {name:"THORNS",showName:"尖刺"},
        {name:"WATER_WORKER",showName:"深海漫遊"},
    ];
    $scope.optionData = [
        {name:"Color",showName:"皮革顏色"},
        {name:"Damage",showName:"傷害增加"},
        {name:"Health",showName:"血量增加"},
        {name:"KnockbackResistance",showName:"擊退抵抗"},
        {name:"MovementSpeed",showName:"移動加速"},
        {name:"Player",showName:"頭顱ID"},
    ];
    $scope.colorList = {
        "0":{font:"white",color:"#000000"},
        "1":{font:"white",color:"#0000aa"},
        "2":{font:"white",color:"#00aa00"},
        "3":{font:"white",color:"#00aaaa"},
        "4":{font:"white",color:"#aa0000"},
        "5":{font:"white",color:"#aa00aa"},
        "6":{font:"black",color:"#ffaa00"},
        "7":{font:"black",color:"#aaaaaa"},
        "8":{font:"white",color:"#555555"},
        "9":{font:"white",color:"#5555ff"},
        "a":{font:"black",color:"#55ff55"},
        "b":{font:"black",color:"#55ffff"},
        "c":{font:"black",color:"#ff5555"},
        "d":{font:"black",color:"#ff55ff"},
        "e":{font:"black",color:"#ffff55"},
        "f":{font:"black",color:"#ffffff"},
    }
}]);
//更新顏色
function updateColorSelector($scope){
    color = $scope.itemColor;
    if($scope.itemColor){
        $scope.selectorColor = {color: $scope.colorList[color].font ,background: $scope.colorList[color].color};
    }else{
        $scope.selectorColor = {color: "black" ,background: "white"};
    }
}
//更新輸出
function update($scope){
    if($scope.itemName){
        $scope.output = $scope.itemName.replace(/\s/g,"_") + ":\n";
        //物品ID
        if($.isNumeric($scope.itemID)){
            $scope.output += "  Id: " + $scope.itemID + "\n";
        }
        //物品Data
        if($.isNumeric($scope.itemData)){
            $scope.output += "  Data: " + $scope.itemData + "\n";
        }
        //顯示名稱
        if($scope.itemColor){
            $scope.output += "  Display: '&" + $scope.itemColor + $scope.itemName + "'\n";
        }else{
            $scope.output += "  Display: '" + $scope.itemName + "'\n";
        }
        if($scope.itemLore){
            $scope.output += "  Lore:\n";
            var lines = $scope.itemLore.split('\n');
            for(var i = 0;i < lines.length && i<9;i++){
                $scope.output += "  - " + lines[i] + "\n";
            }
        }
        //附魔
        var itemEnch = {};
        angular.forEach($scope.enchList, function(value, key){
            if(value && value.selected){
                if(!itemEnch[value.selected]){
                    itemEnch[value.selected] = value.lvl;
                }
            }
        });
        //計算附魔數量
        var countEnch = 0;
        angular.forEach(itemEnch, function(value, key){
            if(key && $.isNumeric(value)){
                countEnch += 1;
            }
        });
        //顯示附魔
        if(countEnch > 0){
            $scope.output += "  Enchantments:\n";
            angular.forEach(itemEnch, function(value, key){
                if(key && $.isNumeric(value)){
                    $scope.output += "  - " + key + ":" + value + "\n";
                }
            });
        }
        //設定
        //計算設定數量
        var countOption = 0;
        //檢查Color格式
        if($scope.option && $scope.option.Color){
            var color = $scope.option.Color.replace("rgb(","").replace(")","");
            var colorList = color.split(",");
            var valueIsColor = false;
            if(colorList.length==3){
                var checkFlag = true
                for (var i = 0; i < 3; i++) {
                    if($.isNumeric(colorList[i])){
                        if(colorList[i]<0 || colorList[i]>255){
                            checkFlag = false;
                            break;
                        }
                    }else{
                        checkFlag = false;
                    }
                };
                if(checkFlag){
                    valueIsColor = true;
                }
            }
        }
        angular.forEach($scope.option, function(value, key){
            if((key && key != "Color" && $.isNumeric(value)) || (key == "Player" && $scope.itemID == 397 && $scope.itemData == 3) || (key == "Color" && valueIsColor && $.inArray($scope.itemID,["298","299","300","301"]) != -1)){
                countOption += 1;
            }
        });
        //顯示設定
        if(countOption > 0){
            $scope.output += "  Options:\n";
            angular.forEach($scope.option, function(value, key){
                if((key && $.isNumeric(value) && $.inArray(key,["Color","Player"]) == -1) || (key == "Player" && $scope.itemID == 397 && $scope.itemData == 3)){
                    $scope.output += "    " + key + ": " + value + "\n";
                }else if(key == "Color" && valueIsColor && $.inArray($scope.itemID,["298","299","300","301"]) != -1){
                    $scope.output += "    " + key + ": " + color + "\n";
                }
            });
        }
    }else{
        $scope.output = "";
    }
} 