var app = angular.module("TestApp", ['ngScrollbars']);

app.controller("TodoListCtrl", TodoListCtrl);

app.filter("Shown", Shown);

function TodoListCtrl($scope) {
    $scope.stateFilter = undefined;
    $scope.colorText = 'standart';
    $scope.saved = localStorage.getItem('todos');
    $scope.todos = JSON.parse($scope.saved);
    localStorage.setItem('todos', JSON.stringify($scope.todos));
    $scope.config = {
            autoHideScrollbar: false,
            theme: 'minimal-dark',
            advanced: {
                updateOnContentResize: true
            },
            setHeight: 200,
            scrollInertia: 1
        }
    $scope.todos.total = 0;
    $scope.addTodo = function() {
        if($scope.todoText && $scope.todoText.length) {
            $scope.todos.push({
                text: $scope.todoText,
                done: false,
                id: new Date(),
                color: $scope.colorText
            });
            $scope.todoText = '';
            localStorage.setItem('todos', JSON.stringify($scope.todos));
        }
        return;
    };

    $scope.removeTodo = function(id) {
        for (var i = 0; i < $scope.todos.length; i++) {
            if ($scope.todos[i].id == id) {
                $scope.todos.splice(i, 1);
                localStorage.setItem('todos', JSON.stringify($scope.todos));
                $scope.$broadcast('rebuild:me');
            }
        }
    };
    $scope.changeState = function(id) {
        for (var i = 0; i < $scope.todos.length; i++) {
            if ($scope.todos[i].id == id) {
                $scope.todos[i].done = !$scope.todos[i].done;
                localStorage.setItem('todos', JSON.stringify($scope.todos));
            }
        }
    }
    $scope.setSelectedTodos = function(state) {
        $scope.stateFilter = state;

    }

    $scope.changeColor = function(color) {
        $scope.colorText = color;
    }
}

function Shown() {
    return function(items, stateFilter) {
        items.total = 0;
        for (var i = 0; i < items.length; i++) {
            if (!angular.isDefined(stateFilter)) {
                items[i].toShow = true;
                items.total++;
            } else {
                items[i].toShow = (items[i].done == stateFilter);
                if (items[i].toShow) items.total++;
            }
        }
        return items;
    }
}
