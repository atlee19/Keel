/**
 * Keel 2021 
 * 
 * Author:    Graham Atlee
 * Created:   05.16.2021
 * 
 * GNU Affero General Public License v3.0
 * 
 * This class handles the mouse swiping interactions 
 * involved with the container list displayed in the main window.
 * There is to be NO logic involved with closing, starting etc. of 
 * Docker containers
 **/

 NodeList.prototype.forEach = Array.prototype.forEach; //not sure what this is yet

 //	Grab our nodes
const activeContainerList = document.querySelector('.activeContainerList');
const activeContainers = activeContainerList.querySelectorAll('.activeContainer');

// Temp
let initialX = 0;

// Settings
const dragOffsetToUpdate = 25;
const heightAnimLength = 150;
const transformAnimLength = 150;
const classCompleting = 'completing';
const classDeleting = 'deleting';
const classComplete = 'completed';

// Utils
function getPointerX(e) {
    //	return pointer offset relative to task list
    const containerList = e.target.parentNode;
    return e.clientX - containerList.getBoundingClientRect().left;
}

function getContainerPositionPercentage(container) {
    //	get task offset relative to list
    var containerLeft = container.getBoundingClientRect().left - list.getBoundingClientRect().left;
    //	return left offset percentage of width
    return Math.floor(containerLeft / container.offsetWidth * 100);
}


function animateContainerHeight(container) {
    let taskHeight = container.offsetHeight;
    //	remove padding, min-height to allow height animation
    container.style.padding = 0;
    container.style.minHeight = 0;
    //	set height as px value to allow height animation
    container.style.height = `${taskHeight}px`;
    //	add transition, force layout  and set height to 0
    container.style.transition = `height ${heightAnimLength}ms ease-out`;
    container.getBoundingClientRect();
    container.style.height = 0;
}

function setContainerStyle(container) {
    //	update some key styles as I'm not allowed to touch the CSS...
    container.style.cursor = 'pointer';
    container.style.userSelect = 'none';
    container.style.webkitUserSelect = 'none';
}

//	Tasks
function setContainerComplete(container) {
    //	slide off screen to the right
    container.style.transform = 'translateX(120%)';
    //	animate height to 0, reset then slide back in
    setTimeout(() => animateContainerHeight(container), 350);
    setTimeout(() => {
      container.classList.add(classComplete);
      //	reset the default styles
      container.style.padding = '';
      container.style.minHeight = '';
      container.style.height = '';
      //	add transform transition, append task to end of list
      container.style.transition = `transform ${transformAnimLength}ms ease-out`;
      container.parentNode.appendChild(container);
      //	force layout and set new transform value to slide back in
      container.getBoundingClientRect();
      container.style.transform = 'translateX(0)';
    }, 500);
}

function setContainerDelete(container) {
    //	slide off screen to the left
    container.style.transform = 'translateX(-120%)';
    //	animate height to 0 then remove
    setTimeout(() => animateContainerHeight(container), 350);
    setTimeout(() => container.parentNode.removeChild(container), 500);
}

//	Actions
function updateContainerStyle(container) {
    //	get percentage position of task
    let percentage = getContainerPositionPercentage(container);
    //	toggle classes if below or above certain threshold
    container.classList.toggle(classCompleting, percentage > dragOffsetToUpdate);
    container.classList.toggle(classDeleting, percentage < dragOffsetToUpdate * -1);
}

function updateContainerStatus(container) {
    //	get percentage position of task
    let percentage = getTaskPositionPercentage(container);
    //	set task status if over/under threshold
    if (percentage > dragOffsetToUpdate && !task.classList.contains(classComplete)) setContainerComplete(task);
    if (percentage < dragOffsetToUpdate * -1) setContainerDelete(task);
}

//	Bind events
function bindMouseDown(container) {
    container.addEventListener('mousedown', eventMouseDown);
}
function bindMouseMove(container) {
    container.addEventListener('mousemove', eventMouseMove);
}
function bindMouseUp(container) {
    container.addEventListener('mouseup', eventMouseUp);
}
function bindMouseLeave(container) {
    container.addEventListener('mouseleave', eventMouseUp);
}

//	Unbind events
function unbindMouseDown(container) {
    container.removeEventListener('mousedown', eventMouseDown);
}
function unbindMouseMove(container) {
    container.removeEventListener('mousemove', eventMouseMove);
}
function unbindMouseUp(container) {
    container.removeEventListener('mouseup', eventMouseUp);
}
function unbindMouseLeave(container) {
    container.removeEventListener('mouseleave', eventMouseUp);
}

//	Events
function eventMouseDown(e) {
    //	cancel if right-click
    if (e.buttons !== 1) return;
    let container = e.target;
    initialX = getPointerX(e);
    //	reset transition
    container.style.transition = '';
    //	bind mouse events
    bindMouseMove(container);
    bindMouseUp(container);
    bindMouseLeave(container);
}

function eventMouseMove(e) {
    let container = e.target;
    let offsetX = getPointerX(e);
    //	set transform to offset
    container.style.transform = `translateX(${Math.floor(offsetX - initialX)}px)`;
    //	update visual
    updateContainerStyle(container);
}

function eventMouseUp(e) {
    //	get current task
    let container = e.target;
    //  unbind events
    unbindMouseMove(container);
    unbindMouseUp(container);
    unbindMouseLeave(container);
    //	set transition, reset translate
    container.style.transition = `transform ${transformAnimLength * 2}ms ease-out`;
    container.style.transform = 'translateX(0)';
    //	update task status
    updateContainerStatus(container);
}
  

function init() {
    activeContainers.forEach(container => {
        setTaskStyle(container);
        bindMouseDown(container);
    });
}
  
init();