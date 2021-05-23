/**
 * Keel 2021 
 * 
 * Author:    Graham Atlee
 * Created:   05.22.2021
 * 
 * GNU Affero General Public License v3.0
 * 
 * This class handles anything that involes controling/displaying
 * containers to the main window. This class directly interacts with
 * the DOM.
 **/

const displayContainers = (function(){

    const hostContainers = require('./hostContainers');

    async function show(){
        let containerData = await hostContainers.GetListOfActiveContainers();
        let containerList = document.getElementById('containerList');
        containerData.forEach(container => {
            containerList.innerHTML += `
                <li id=${container.Id} class="activeContainer">${container.Name}
                    <ul>
                        <li>image: ${container.Id}</li>
                    </ul>
                </li>`;
        });

        //once the containers are written to the page we can the enable the swiping UI logic
        //must be done like this - for now.
        const swipeContainers = require('./swipeContainer');
        swipeContainers.EnableSwiping();
    }

    return{
        Show: show
    }
})();


module.exports = displayContainers;