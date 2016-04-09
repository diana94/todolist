var app = angular.module("TestApp", ['ngScrollbars', 'LocalStorageModule']);

app.controller("TodoListCtrl", todoListCtrl);

app.filter("Shown", shown);

app.filter("Sort", sort);

function todoListCtrl($scope, localStorageService) {

    $scope.addTodo = addTodo;
    $scope.removeTodo = removeTodo;
    $scope.changeState = changeState;
    $scope.setSelectedTodos = setSelectedTodos;
    $scope.changeColor = changeColor;

    activate();

    function activate(){
        $scope.colorText = 'standart';
        $scope.config = {
            autoHideScrollbar: false,
            theme: 'minimal-dark',
            advanced: {
                updateOnContentResize: true
            },
            setHeight: 200,
            scrollInertia: 1
        };
        var tmpSaved = localStorageService.get('todos');
        $scope.todos = tmpSaved ? tmpSaved : [];
    };

    function addTodo() {
        if($scope.todoText && $scope.todoText.length) {
            $scope.todos.push({
                id: guid(),
                text: $scope.todoText,
                color: $scope.colorText,
                updatedAt: new Date(),
                done: false
            });
            $scope.todoText = '';
            localStorageService.set('todos', $scope.todos);
        }
    };

    function removeTodo(id) {
        $scope.todos = _.filter($scope.todos, function(it) { return it.id != id; });
        localStorageService.set('todos', $scope.todos);
        $scope.$broadcast('rebuild:me');
    };

    function changeState(id) {
        var todo = _.find($scope.todos, { id : id });
        todo.done = !todo.done;
        todo.updatedAt = new Date();
        localStorageService.set('todos', $scope.todos);
    };

    function setSelectedTodos(state) {
        $scope.stateFilter = state;
    };

    function changeColor(color) {
        $scope.colorText = color;
    };

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        };
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };
};

function shown() {
    return function(items, stateFilter) {
        if (items){
            _.each(items, function(it){
                if (angular.isDefined(stateFilter))
                    it.toShow = (it.done == stateFilter);
                else
                    it.toShow = true;
            });
        }
        return items;
    };
};

function sort() {
    return function(items) {
        var resDone =[];
        var resNotDone =[];
        _.each(items, function(it){
            if (it.done)
                resDone.push(it);
            else
                resNotDone.push(it);
        });
        function parseDate(val){
            return (typeof val === 'string') ? Date.parse(val) : val;
        };
        function doneComparator(a, b){
            return parseDate(a.updatedAt) >= parseDate(b.updatedAt);
        };
        function notDoneComparator(a, b){
            return parseDate(a.updatedAt) <= parseDate(b.updatedAt);
        };
        resDone.sort(doneComparator);
        resNotDone.sort(notDoneComparator);
        return [].concat(resNotDone, resDone);
    };
};
