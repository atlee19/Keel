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
 * 
 * Remeber there is STOPPING a container and DELETING a container
 **/

const swipeContainers = (function (){

    //grab nodes 
    const activeContainerList = document.querySelector('.activeContainerList');
    const activeContainers = activeContainerList.querySelectorAll('.activeContainer');

    const hostContainers = require('./hostContainers');

    // Temp
    let initialX = 0;

    // Settings
    const dragOffsetToUpdate = 25; //threshold for dragging left or right before toggle changes
    const heightAnimLength = 150;
    const transformAnimLength = 150;
    const classCompleting = 'completing';
    const classDeleting = 'deleting';
    const classComplete = 'completed';

    // Utility functions
    function getPointerX(e) {
        //	return pointer offset relative to container list
        const containerList = e.target.parentNode;
        return e.clientX - containerList.getBoundingClientRect().left;
    }

    function getContainerPositionPercentage(container) {
        //	get container offset relative to list
        var containerLeft = container.getBoundingClientRect().left - activeContainerList.getBoundingClientRect().left;
        //	return left offset percentage of width
        return Math.floor(containerLeft / container.offsetWidth * 100);
    }


    function animateContainerHeight(container) {
        let containerHeight = container.offsetHeight;
        //	remove padding, min-height to allow height animation
        container.style.padding = 0;
        container.style.minHeight = 0;
        //	set height as px value to allow height animation
        container.style.height = `${containerHeight}px`;
        //	add transition, force layout  and set height to 0
        container.style.transition = `height ${heightAnimLength}ms ease-out`;
        container.getBoundingClientRect();
        container.style.height = 0;
    }

        // Containers
    function stopContainer(container) {
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
        //	add transform transition, append container to end of list
        container.style.transition = `transform ${transformAnimLength}ms ease-out`;
        container.parentNode.appendChild(container);
        //	force layout and set new transform value to slide back in
        container.getBoundingClientRect();
        container.style.transform = 'translateX(0)';
        }, 500);

        //call to dockerode service to actually stop the container 
        hostContainers.StopSpecificContainer(container.id);
    }

    //the function that actually triggers deleting the container.
    function setContainerDelete(container) {
        //slide off screen to the left
        container.style.transform = 'translateX(-120%)';
        //animate height to 0 then remove
        setTimeout(() => animateContainerHeight(container), 350);
        setTimeout(() => container.parentNode.removeChild(container), 500);
    }

    //Actions

    //this function name is misleading?
    function updateContainerStyle(container) {
        //	get percentage position of container
        let percentage = getContainerPositionPercentage(container);
        //toggle classes if below or above certain threshold
        //if positive percentage (being dragged right) then the class list updated to completing
        container.classList.toggle(classCompleting, percentage > dragOffsetToUpdate);
        //if negative percentage (being dragged left) then the class list is updated to deleting
        container.classList.toggle(classDeleting, percentage < dragOffsetToUpdate * -1);
    }

    function updateContainerStatus(container) {
        //get percentage position of container
        let percentage = getContainerPositionPercentage(container);
        //set container status if over/under threshold
        //if container dragged right behond the threshold and released then set the container
        //is called
        if (percentage > dragOffsetToUpdate && !container.classList.contains(classComplete)) stopContainer(container);
        //if container dragged left beyond the threshold and released then set delete the container
        //will be called 
        if (percentage < dragOffsetToUpdate * -1) setContainerDelete(container);
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
        //	get current container
        let container = e.target;
        //  unbind events
        unbindMouseMove(container);
        unbindMouseUp(container);
        unbindMouseLeave(container);
        //	set transition, reset translate
        container.style.transition = `transform ${transformAnimLength * 2}ms ease-out`;
        container.style.transform = 'translateX(0)';
        //	update container status
        updateContainerStatus(container);
    }
    

    function enableSwiping() {
        activeContainers.forEach(container => {
            bindMouseDown(container);
        });
    }

    return{
        EnableSwiping: enableSwiping
    }

})();


module.exports = swipeContainers;


//NodeList.prototype.forEach = Array.prototype.forEach; //not sure what this is yet

 //	Grab our nodes
// const activeContainerList = document.querySelector('.activeContainerList');
// const activeContainers = activeContainerList.querySelectorAll('.activeContainer');

// const hostContainers = require('./hostContainers');

// Temp
// let initialX = 0;

// Settings
// const dragOffsetToUpdate = 25; //threshold for dragging left or right before toggle changes
// const heightAnimLength = 150;
// const transformAnimLength = 150;
// const classCompleting = 'completing';
// const classDeleting = 'deleting';
// const classComplete = 'completed';

// Utils
// function getPointerX(e) {
//     //	return pointer offset relative to container list
//     const containerList = e.target.parentNode;
//     return e.clientX - containerList.getBoundingClientRect().left;
// }

// function getContainerPositionPercentage(container) {
//     //	get container offset relative to list
//     var containerLeft = container.getBoundingClientRect().left - activeContainerList.getBoundingClientRect().left;
//     //	return left offset percentage of width
//     return Math.floor(containerLeft / container.offsetWidth * 100);
// }


// function animateContainerHeight(container) {
//     let containerHeight = container.offsetHeight;
//     //	remove padding, min-height to allow height animation
//     container.style.padding = 0;
//     container.style.minHeight = 0;
//     //	set height as px value to allow height animation
//     container.style.height = `${containerHeight}px`;
//     //	add transition, force layout  and set height to 0
//     container.style.transition = `height ${heightAnimLength}ms ease-out`;
//     container.getBoundingClientRect();
//     container.style.height = 0;
// }


// // Containers
// function stopContainer(container) {
//     //	slide off screen to the right
//     container.style.transform = 'translateX(120%)';
//     //	animate height to 0, reset then slide back in
//     setTimeout(() => animateContainerHeight(container), 350);
//     setTimeout(() => {
//       container.classList.add(classComplete);
//       //	reset the default styles
//       container.style.padding = '';
//       container.style.minHeight = '';
//       container.style.height = '';
//       //	add transform transition, append container to end of list
//       container.style.transition = `transform ${transformAnimLength}ms ease-out`;
//       container.parentNode.appendChild(container);
//       //	force layout and set new transform value to slide back in
//       container.getBoundingClientRect();
//       container.style.transform = 'translateX(0)';
//     }, 500);

//     //call to dockerode service to actually stop the container 
//     hostContainers.StopSpecificContainer(container.id);
// }

// //the function that actually triggers deleting the container.
// function setContainerDelete(container) {
//     //slide off screen to the left
//     container.style.transform = 'translateX(-120%)';
//     //animate height to 0 then remove
//     setTimeout(() => animateContainerHeight(container), 350);
//     setTimeout(() => container.parentNode.removeChild(container), 500);
// }

// //Actions

// //this function name is misleading?
// function updateContainerStyle(container) {
//     //	get percentage position of container
//     let percentage = getContainerPositionPercentage(container);
//     //toggle classes if below or above certain threshold
//     //if positive percentage (being dragged right) then the class list updated to completing
//     container.classList.toggle(classCompleting, percentage > dragOffsetToUpdate);
//     //if negative percentage (being dragged left) then the class list is updated to deleting
//     container.classList.toggle(classDeleting, percentage < dragOffsetToUpdate * -1);
// }

// function updateContainerStatus(container) {
//     //get percentage position of container
//     let percentage = getContainerPositionPercentage(container);
//     //set container status if over/under threshold
//     //if container dragged right behond the threshold and released then set the container
//     //is called
//     if (percentage > dragOffsetToUpdate && !container.classList.contains(classComplete)) stopContainer(container);
//     //if container dragged left beyond the threshold and released then set delete the container
//     //will be called 
//     if (percentage < dragOffsetToUpdate * -1) setContainerDelete(container);
// }

// //	Bind events
// function bindMouseDown(container) {
//     container.addEventListener('mousedown', eventMouseDown);
// }
// function bindMouseMove(container) {
//     container.addEventListener('mousemove', eventMouseMove);
// }
// function bindMouseUp(container) {
//     container.addEventListener('mouseup', eventMouseUp);
// }
// function bindMouseLeave(container) {
//     container.addEventListener('mouseleave', eventMouseUp);
// }

// //	Unbind events
// function unbindMouseDown(container) {
//     container.removeEventListener('mousedown', eventMouseDown);
// }
// function unbindMouseMove(container) {
//     container.removeEventListener('mousemove', eventMouseMove);
// }
// function unbindMouseUp(container) {
//     container.removeEventListener('mouseup', eventMouseUp);
// }
// function unbindMouseLeave(container) {
//     container.removeEventListener('mouseleave', eventMouseUp);
// }

// //	Events
// function eventMouseDown(e) {
//     //	cancel if right-click
//     if (e.buttons !== 1) return;
//     let container = e.target;
//     initialX = getPointerX(e);
//     //	reset transition
//     container.style.transition = '';
//     //	bind mouse events
//     bindMouseMove(container);
//     bindMouseUp(container);
//     bindMouseLeave(container);
// }

// function eventMouseMove(e) {
//     let container = e.target;
//     let offsetX = getPointerX(e);
//     //	set transform to offset
//     container.style.transform = `translateX(${Math.floor(offsetX - initialX)}px)`;
//     //	update visual
//     updateContainerStyle(container);
// }

// function eventMouseUp(e) {
//     //	get current container
//     let container = e.target;
//     //  unbind events
//     unbindMouseMove(container);
//     unbindMouseUp(container);
//     unbindMouseLeave(container);
//     //	set transition, reset translate
//     container.style.transition = `transform ${transformAnimLength * 2}ms ease-out`;
//     container.style.transform = 'translateX(0)';
//     //	update container status
//     updateContainerStatus(container);
// }
  

// function init() {
//     activeContainers.forEach(container => {
//         bindMouseDown(container);
//     });
// }

// //module export - KIM everything will get allocated the moment we call require 
// //not a big fan of how I did this. Might want to consider using the Revealing Module Pattern.
// const swipeContainers = {
//     enableSwiping : function(){
//         init();
//     }
// }

// module.exports = swipeContainers;