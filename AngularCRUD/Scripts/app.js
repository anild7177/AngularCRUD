var TodoApp = angular.module('TodoApp', ['ngResource','ngRoute']);

TodoApp.config(function ($routeProvider) {
    $routeProvider
        .when('/', { controller: 'ListController', templateUrl: 'Partials/list.html' })
        .when('/new', { controller: 'CreateController', templateUrl: 'Partials/details.html' })
        .when('/edit/:editId', { controller: 'EditController', templateUrl: 'Partials/details.html' })
        .otherwise({ redirectTo: '/' });
});

TodoApp.factory('todo', function ($resource) {
    return $resource("/api/Todo/:id", { id: '@id' }, { update: { method: 'PUT' }});
});

TodoApp.controller('ListController', function ($scope, todo) {
    //get
    $scope.search = function () {
        todo.query({
            q: $scope.query,
            sort: $scope.sort_criteria,
            desc: $scope.is_desc,
            offset: $scope.offset,
            limit: $scope.limit
        },
        function (data) {
            $scope.more = data.length === $scope.limit;
            $scope.todos = $scope.todos.concat(data);
        });
    };

    //sort
    $scope.sort = function (column) {
        if ($scope.sort_criteria === column) {
            $scope.is_desc = !$scope.is_desc;
        } else {
            $scope.sort_criteria = column;
            $scope.is_desc = false;
        }
        
        $scope.reset();
    };

    $scope.show_more = function() {
        $scope.offset += $scope.limit;
        $scope.search();
    };

    $scope.has_more = function() {
        return $scope.more;
    };

    $scope.reset = function() {
        $scope.limit = 10;
        $scope.offset = 0;
        $scope.todos = [];
        $scope.more = true;

        $scope.search();
    };

    $scope.delete = function() {
        var id = this.todo.Id;
        todo.delete({ id: id }, function() {
            $('#todo_' + id).fadeOut();
        });
    };

    $scope.sort_criteria = "Priority";
    $scope.is_desc = false;
    

    $scope.reset();
});

TodoApp.controller('CreateController', function($scope, todo, $location) {
    $scope.save = function() {
        todo.save($scope.item, function() {
            $location.path('/');
        });
    };
});

TodoApp.controller('EditController', function($scope, $location, todo, $routeParams) {
    var id = $routeParams.editId;
    $scope.item = todo.get({ id: id });

    $scope.save = function() {
        todo.update({id: id}, $scope.item, function() {
            $location.path('/');
        });
    };
});