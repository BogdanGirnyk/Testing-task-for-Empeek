

var mainApp = angular.module("mainApp", ['ui.bootstrap']);


function isEmpty(str) {
    return (!str || 0 === str.length);
};


function calculateStatistics(items) {
    dic = {};
    statistics = [];
    for (i = 0; i < items.length; i++)
        dic[items[i].Type] = 0;
    for (i = 0; i < items.length; i++)
        dic[items[i].Type] += 1;
    for (var key in dic) 
        statistics.push({ "Type": key, "Count": dic[key]})
    return statistics;
};

mainApp.controller('itemListController', function ($scope, $http, $timeout) {
    $scope.DataLoading = true;
    $http.get('/api/GetItems').
        success(function (data, status, headers, config) {
            $scope.items = data;
            $scope.statistics = calculateStatistics($scope.items);
            

            $scope.selected = {};
            $scope.errorInHttpRequest = false;

            $scope.invalidNewItemInput = false;
            $scope.invalidEditItemInput = false;

            $scope.currentPage = 1;
            $scope.itemsPerPage = 4;
            $scope.maxSize = 5; 

            $scope.currentPageT2 = 1;
            $scope.itemsPerPageT2 = 3;
            $scope.maxSize = 5; 

            $scope.DataLoading = false;
        });

  

    $scope.getTemplate = function (item) {
        if (item.Id === $scope.selected.Id) return 'edit';
        else return 'display';
    };

    $scope.editItem = function (item) {
        $scope.selected = angular.copy(item);
    };

    $scope.reset = function () {
        $scope.selected = {};
        $scope.newItemName = '';
        $scope.newItemType = '';
        $scope.invalidNewItemInput = false;
        $scope.invalidEditItemInput = false;
        $scope.errorInHttpRequest = false;

    };

    $scope.saveEditedItem = function (item) {
        $scope.invalidEditItemInput = isEmpty(item.Name) || isEmpty(item.Type);
        if (!$scope.invalidEditItemInput) {
            $http.post('/api/EditItem', item).success(function (data, status, headers, config) {
                var oldItem = $scope.items.find(x => x.Id === item.Id);;

                oldItem.Name = item.Name;
                oldItem.Type = item.Type;

                $scope.reset();
                $scope.statistics = calculateStatistics($scope.items);
            }).error(function (data, status, headers, config ) {
                $scope.errorInHttpRequest = true;
                });


        }
    };

    $scope.addItem = function (newItemName, newItemType) {
        $scope.invalidNewItemInput = isEmpty(newItemName) || isEmpty(newItemType);
        if (!$scope.invalidNewItemInput) {
            var itemToAdd = {
                Id: "",
                Name: newItemName,
                Type: newItemType
            };
            $http.post('/api/NewItem', itemToAdd).success(function (data, status, headers, config) {
                itemToAdd.Id = data;
                $scope.items.push(itemToAdd);
                $scope.reset();
                $scope.statistics = calculateStatistics($scope.items); 
                $scope.currentPage = Math.ceil($scope.items.length / $scope.itemsPerPage);

            }).error(function (data, status, headers, config ) {
                $scope.errorInHttpRequest = true;

            });
        }

    };

    $scope.deleteItem = function (item) {

        $http.post('/api/DeleteItem',item).success(function (data, status, headers, config) {
            $scope.items.splice($scope.items.indexOf(item), 1);
            $scope.statistics = calculateStatistics($scope.items);
        }).error(function (data, status, headers, config ) {
            $scope.errorInHttpRequest = true;

        });

    };



}


     
);



