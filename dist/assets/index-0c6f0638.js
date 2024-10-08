var K=Object.defineProperty;var U=(t,e,s)=>e in t?K(t,e,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[e]=s;var u=(t,e,s)=>(U(t,typeof e!="symbol"?e+"":e,s),s);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const m of r.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&i(m)}).observe(document,{childList:!0,subtree:!0});function s(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(a){if(a.ep)return;a.ep=!0;const r=s(a);fetch(a.href,r)}})();const y="data-js-selector";function n(t){return`[${y}="${t}"]`}function l(t,e){return typeof e>"u"?`data-js-${t}`:`data-js-${t}="${e}"`}function c(t,e){return(e||document).querySelector(t)}function h(t,e){if(!t||t.parentNode===null)return null;for(;t&&!t.matches(e);)t=t.parentElement;return t}function v(t){t.value="",t.focus()}const S="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",F=17;function $(){const t=Date.now().toString(36),e=H(F-1);return t[Math.floor(Math.random()*t.length)]+e}function H(t){return Array.from({length:t},()=>S[Math.floor(Math.random()*S.length)]).join("")}function A(t){if(Object.prototype.toString.call(t)!=="[object Object]")return!1;const e=Object.getPrototypeOf(t);return e===Object.prototype||e===null}function G(t,e){switch(e.type){case"SET_FILTER_STATUS":return{...t,filters:{...t.filters,status:e.payload}};case"SET_FILTER_PRIORITY":return{...t,filters:{...t.filters,priority:e.payload}};default:return t}}function z(t,e){switch(e.type){case"ADD_LIST":return{...t,lists:[...t.lists,e.payload]};case"EDIT_LIST":return{...t,lists:t.lists.map(s=>s.id===e.payload.id?{...s,name:e.payload.name}:s)};case"REMOVE_LIST":return{...t,lists:t.lists.filter(s=>s.id!==e.payload),tasks:t.tasks.filter(s=>s.listId!==e.payload)};case"SET_ACTIVE_LIST":return{...t,lists:t.lists.map(s=>s.id===e.payload?{...s,isActive:!0}:{...s,isActive:!1})};default:return t}}function J(t,e){switch(e.type){case"SET_LOCALE":return{...t,locale:e.payload};default:return t}}const x={min:60*1e3,h:60*60*1e3,d:24*60*60*1e3,w:7*24*60*60*1e3,m:30*24*60*60*1e3,y:365*24*60*60*1e3};function q(t){const e=t.match(/^(-?\d+)(min|h|d|w|m|y)$/);if(!e)throw new Error("Invalid time string format");const[,s,i]=e,a=parseInt(s,10);if(isNaN(a)||a<0)throw new Error("Invalid numeric value");return a*x[i]}function Y(t){if(t<0)throw new Error("Milliseconds must be a non-negative number");const e=["y","m","w","d","h","min"];for(const s of e){const i=Math.floor(t/x[s]);if(i>0)return`${i}${s}`}return"0min"}function W(t,e){switch(e.type){case"ADD_TASK":return{...t,tasks:[...t.tasks,e.payload]};case"EDIT_TASK":return{...t,tasks:t.tasks.map(s=>s.id===e.payload.id?{...s,...e.payload}:s)};case"REMOVE_TASK":return{...t,tasks:t.tasks.filter(s=>s.id!==e.payload)};case"REMOVE_COMPLETED_TASKS":return{...t,tasks:t.tasks.filter(s=>!(s.listId===e.payload&&s.completed))};case"TOGGLE_ALL_TASKS_AS_COMPLETED":return{...t,tasks:t.tasks.map(s=>s.listId===e.payload.listId?{...s,completed:e.payload.checked,completedAt:e.payload.checked?Date.now():null}:s)};case"MARK_ALL_TASKS_AS_COMPLETED":return{...t,tasks:t.tasks.map(s=>s.listId===e.payload&&!s.completed?{...s,completed:!0,completedAt:Date.now()}:s)};case"UPDATE_TASKS_REMAINING_TIME":return{...t,tasks:t.tasks.map(s=>{if(s.estimateTime){const i=Date.now()-s.createdAt,a=q(s.estimateTime)-i;return{...s,remainingTime:Y(a),timeSpent:i}}return s})};default:return t}}function Q(t,e){switch(e.type){case"SET_THEME":return{...t,theme:e.payload};default:return t}}function X(t,e){switch(e.type){case"SET_THEME":return Q(t,e);case"SET_LOCALE":return J(t,e);case"ADD_LIST":case"EDIT_LIST":case"REMOVE_LIST":case"SET_ACTIVE_LIST":return z(t,e);case"ADD_TASK":case"EDIT_TASK":case"REMOVE_TASK":case"REMOVE_COMPLETED_TASKS":case"MARK_ALL_TASKS_AS_COMPLETED":case"TOGGLE_ALL_TASKS_AS_COMPLETED":case"UPDATE_TASKS_REMAINING_TIME":return W(t,e);case"SET_FILTER_STATUS":case"SET_FILTER_PRIORITY":return G(t,e);default:return console.error("Unknown action",e),t}}const E="todolistapp++";class Z{constructor(e,s){u(this,"state");u(this,"reducer");u(this,"listeners",new Set);u(this,"storage",null);this.state=s,this.initStorage(),this.storage!==null&&this.loadFromStorage(),this.reducer=e}getState(){return this.state}dispatch(e){this.state=this.reducer(this.state,e),this.saveToStorage(),this.notifyListeners()}subscribe(e){return this.listeners.add(e),()=>{this.listeners.delete(e)}}initStorage(){typeof window<"u"&&window.localStorage?this.storage=window.localStorage:(this.storage=null,console.warn("localStorage is not available in this environment"))}notifyListeners(){this.listeners.forEach(e=>e())}parseJSON(e){try{return JSON.parse(e)}catch{return null}}loadFromStorage(){if(!this.storage)return null;const e=this.parseJSON(this.storage.getItem(E));if(A(e)){const{theme:s=this.state.theme,locale:i=this.state.locale,lists:a,tasks:r,filters:m}=e,T={theme:s,locale:i,lists:Array.isArray(a)?a:this.state.lists,tasks:Array.isArray(r)?r:this.state.tasks,filters:A(m)?m:this.state.filters};this.state={...this.state,...T}}return e}saveToStorage(){this.storage&&this.storage.setItem(E,JSON.stringify(this.state))}}const ee={theme:"dark",locale:"en",lists:[],tasks:[],filters:{status:"all",priority:"all"}},d=new Z(X,ee),te={en:{actions:{add:"Add",edit:"Edit",move:"Move",remove:"Remove",update:"Update",open:"Open",close:"Close",cancel:"Cancel",done:"Done",ok:"Ok",sort:"Sort"},flags:{en:"Flag of the United Kingdom",br:"Flag of Brazil",es:"Flag of Spain",ua:"Flag of Ukraine",ru:"Flag of Russia"},date:"Date",default:"Default",lists:{lists:"Lists",new:"New List",edit:"Edit List",remove:"Remove List",inputPlaceholder:"New List...",noLists:"No lists are created yet",noListSelected:"No list selected"},moon:"Moon",none:"None",sun:"Sun",tasks:{tasks:"Tasks",new:"New Task",edit:"Edit task",remove:"Remove task",moveToList:"Move to list",inputPlaceholder:"New Task...",priority:{label:"Priority",high:"High",medium:"Medium",low:"Low",none:"None"},at:"at",createdAt:"Created at",completedAt:"Completed at",estimateTime:"Estimate time",remainingTime:"Remaining time",left:"tasks left",noTasks:"No tasks are created yet",filter:{all:"All",active:"Active",completed:"Completed"},clearCompleted:"Clear completed",completeAll:"Complete all",markAllAsCompleted:"Mark all as completed"},sort:"Sort",toggleTheme:"Toggle theme"},"pt-br":{actions:{add:"Adicionar",edit:"Editar",move:"Mover",remove:"Remover",update:"Atualizar",open:"Abrir",close:"Fechar",cancel:"Cancelar",done:"Concluído",ok:"Ok",sort:"Ordenar"},flags:{en:"Bandeira do Reino Unido",br:"Bandeira do Brasil",es:"Bandeira da Espanha",ua:"Bandeira da Ucrânia",ru:"Bandeira da Rússia"},date:"Data",default:"Padrão",lists:{lists:"Listas",new:"Nova Lista",edit:"Editar Lista",remove:"Remover Lista",inputPlaceholder:"Nova Lista...",noLists:"Nenhuma lista foi criada ainda",noListSelected:"Nenhuma lista selecionada"},moon:"Lua",none:"Nenhuma",sun:"Sol",tasks:{tasks:"Tarefas",new:"Nova Tarefa",edit:"Editar tarefa",remove:"Remover tarefa",moveToList:"Mover para a lista",inputPlaceholder:"Nova Tarefa...",priority:{label:"Prioridade",high:"Alta",medium:"Média",low:"Baixa",none:"Nenhuma"},at:"às",createdAt:"Criado em",completedAt:"Concluído em",estimateTime:"Tempo estimado",remainingTime:"Tempo restante",left:"tarefas restantes",noTasks:"Nenhuma tarefa foi criada ainda",filter:{all:"Todas",active:"Ativas",completed:"Concluídas"},clearCompleted:"Limpar concluídas",completeAll:"Concluir tudo",markAllAsCompleted:"Marcar tudo como concluído"},sort:"Ordenar",toggleTheme:"Alternar tema"},es:{actions:{add:"Añadir",edit:"Editar",move:"Mover",remove:"Eliminar",update:"Actualizar",open:"Abrir",close:"Cerrar",cancel:"Cancelar",done:"Hecho",ok:"Ok",sort:"Ordenar"},flags:{en:"Bandera del Reino Unido",br:"Bandera de Brasil",es:"Bandera de España",ua:"Bandera de Ucrania",ru:"Bandera de Rusia"},date:"Fecha",default:"Predeterminado",lists:{lists:"Listas",new:"Nueva Lista",edit:"Editar Lista",remove:"Eliminar Lista",inputPlaceholder:"Nueva Lista...",noLists:"Aún no se ha creado ninguna lista",noListSelected:"No se ha seleccionado ninguna lista"},moon:"Luna",none:"Ninguna",sun:"Sol",tasks:{tasks:"Tareas",new:"Nueva Tarea",edit:"Editar tarea",remove:"Eliminar tarea",moveToList:"Mover a la lista",inputPlaceholder:"Nueva Tarea...",priority:{label:"Prioridad",high:"Alta",medium:"Media",low:"Baja",none:"Ninguna"},at:"a las",createdAt:"Creado el",completedAt:"Completado a las",estimateTime:"Tiempo estimado",remainingTime:"Tiempo restante",left:"tareas restantes",noTasks:"Aún no se ha creado ninguna tarea",filter:{all:"Todas",active:"Activas",completed:"Completadas"},clearCompleted:"Limpiar completadas",completeAll:"Completar todo",markAllAsCompleted:"Marcar todo como completado"},sort:"Ordenar",toggleTheme:"Alternar tema"},ua:{actions:{add:"Додати",edit:"Редагувати",move:"Перемістити",remove:"Видалити",update:"Оновити",open:"Відкрити",close:"Закрити",cancel:"Скасувати",done:"Готово",ok:"Ок",sort:"Сортувати"},flags:{en:"Прапор Сполученого Королівства",br:"Прапор Бразилії",es:"Прапор Іспанії",ua:"Прапор України",ru:"Прапор Росії"},date:"Дата",default:"За замовчуванням",lists:{lists:"Списки",new:"Новий список",edit:"Редагувати список",remove:"Видалити список",inputPlaceholder:"Новий список...",noLists:"Списки ще не створені",noListSelected:"Список не вибрано"},moon:"Місяць",none:"Немає",sun:"Сонце",tasks:{tasks:"Завдання",new:"Нове завдання",edit:"Редагувати завдання",remove:"Видалити завдання",moveToList:"Перемістити до списку",inputPlaceholder:"Нове завдання...",priority:{label:"Пріоритет",high:"Високий",medium:"Середній",low:"Низький",none:"Немає"},at:"о",createdAt:"Створено",completedAt:"Завершено о",estimateTime:"Орієнтовний час",remainingTime:"Залишковий час",left:"залишилося завдань",noTasks:"Завдання ще не створені",filter:{all:"Усі",active:"Активні",completed:"Виконані"},clearCompleted:"Очистити виконані",completeAll:"Завершити все",markAllAsCompleted:"Позначити все як завершене"},sort:"Сортувати",toggleTheme:"Перемкнути тему"},ru:{actions:{add:"Добавить",edit:"Редактировать",move:"Переместить",remove:"Удалить",update:"Обновить",open:"Открыть",close:"Закрыть",cancel:"Отменить",done:"Готово",ok:"Ок",sort:"Сортировать"},flags:{en:"Флаг Соединенного Королевства",br:"Флаг Бразилии",es:"Флаг Испании",ua:"Флаг Украины",ru:"Флаг России"},date:"Дата",default:"По умолчанию",lists:{lists:"Списки",new:"Новый список",edit:"Редактировать список",remove:"Удалить список",inputPlaceholder:"Новый список...",noLists:"Списки еще не созданы",noListSelected:"Список не выбран"},moon:"Луна",none:"Нет",sun:"Солнце",tasks:{tasks:"Задачи",new:"Новая задача",edit:"Редактировать задачу",remove:"Удалить задачу",moveToList:"Переместить в список",inputPlaceholder:"Новая задача...",priority:{label:"Приоритет",high:"Высокий",medium:"Средний",low:"Низкий",none:"Нет"},at:"в",createdAt:"Создано",completedAt:"Завершено в",estimateTime:"Расчетное время",remainingTime:"Оставшееся время",left:"осталось задач",noTasks:"Задачи еще не созданы",filter:{all:"Все",active:"Активные",completed:"Выполненные"},clearCompleted:"Очистить выполненные",completeAll:"Завершить все",markAllAsCompleted:"Отметить всё как завершённое"},sort:"Сортировать",toggleTheme:"Переключить тему"}};function se(t,e){return e.reduce((s,i)=>s&&typeof s=="object"?s[i]:void 0,t)}class ie{constructor(){}t(e){const s=d.getState().locale,i=se(te[s],e.split("."));return typeof i!="string"?(console.warn(`Translation not found for key: ${e}`),e):i}}const o=new ie,ae=t=>d.dispatch({type:"SET_FILTER_STATUS",payload:t}),oe=t=>d.dispatch({type:"ADD_LIST",payload:t}),re=t=>d.dispatch({type:"EDIT_LIST",payload:t}),ne=t=>d.dispatch({type:"REMOVE_LIST",payload:t}),le=t=>d.dispatch({type:"SET_ACTIVE_LIST",payload:t}),ce=t=>d.dispatch({type:"ADD_TASK",payload:t}),C=t=>d.dispatch({type:"EDIT_TASK",payload:t}),de=t=>d.dispatch({type:"REMOVE_TASK",payload:t}),ue=t=>d.dispatch({type:"REMOVE_COMPLETED_TASKS",payload:t}),me=t=>d.dispatch({type:"MARK_ALL_TASKS_AS_COMPLETED",payload:t}),he=t=>d.dispatch({type:"TOGGLE_ALL_TASKS_AS_COMPLETED",payload:t});function _({selector:t}){return`
            <button ${l("selector",t)}
                aria-label=${o.t("actions.add")}
                class="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-400"
            >${o.t("actions.add")}</button>
        `}function I({selector:t,text:e,textSecondPart:s}){return`
        <h2 ${l("selector",t)} class="text-xl font-semibold mb-4"><span>${e}</span>${s?" - <span>"+s+"</span>":""}</h2>
     `}function M({selector:t}){return`
			<button ${l("selector",t)}
			  aria-label=${o.t("actions.edit")}
			  class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
			>
			  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
			  </svg>
			  <span class="ml-2 hidden 3xl:inline">${o.t("actions.edit")}</span>
			</button>
		`}function O({selector:t}){return`
            <button
              ${l("selector",t)}
              aria-label=${o.t("actions.remove")}
              class="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-gray-700 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span class="ml-2 hidden 3xl:inline">${o.t("actions.remove")}</span>
            </button>
        `}function pe({id:t,name:e}){return`
            <li
                ${l("selector","list-of-lists-item")} ${l("list-id",t)}
                class="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-md hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer"
            >
                <div ${l("selector","list-of-lists-item-name")} class="text-ellipsis overflow-hidden">${e}</div>
                <div class="flex flex-wrap justify-end gap-2 w-full md:w-auto">
                    ${M({selector:"edit-list-button"})}
                    ${O({selector:"remove-list-button"})}
                </div>
            </li>
        `}function R({selector:t,placeholder:e,ariaLabel:s,customClass:i}){return`
        <input
            ${l("selector",t)}
            type="text"
            aria-label="${s}"
            placeholder="${e}"
            class="w-full p-2 bg-white dark:bg-gray-700 rounded-md border focus:ring-2 focus:ring-indigo-500 dark:border-gray-600 ${i??""}"
        />
    `}class fe{constructor(e){u(this,"state");u(this,"root");u(this,"unsubscribe");u(this,"onClickBinded");this.state=e,this.root=c(n("list-of-lists-container")),this.onClickBinded=this.onClick.bind(this),this.root.addEventListener("click",this.onClick.bind(this)),this.unsubscribe=d.subscribe(this.updateState.bind(this))}render(){return this.root.innerHTML=`
			${I({selector:"list-of-lists-title",text:o.t("lists.lists")})}

            <div class="flex items-center gap-2 mb-4">
                ${R({selector:"list-input",ariaLabel:o.t("lists.new"),placeholder:o.t("lists.inputPlaceholder")})}
                ${_({selector:"add-list-button"})}
            </div>

            <ul
                ${l("selector","list-of-lists")}
                role="list"
                aria-label=${o.t("lists.lists")}
                class="space-y-2"
            >
                ${this.state.lists.map(e=>pe(e)).join("")}
            </ul>
        `,this.root.innerHTML}destroy(){this.root.removeEventListener("click",this.onClickBinded),this.unsubscribe()}updateState(){const{lists:e}=d.getState();this.state={...this.state,lists:e},this.render()}onClick(e){let s=e.target;if(s&&!s.dataset.jsSelector&&(s=s.closest(`[${y}]`)),!s)return;const i=s.dataset.jsSelector;if(i==="add-list-button"){s.dataset.editListId?this.onUpdateListClick(s.dataset.editListId):this.onAddListClick();return}if(i==="list-of-lists-item-name"){this.onItemClick(h(s,n("list-of-lists-item")));return}if(i==="list-of-lists-item"){this.onItemClick(s);return}if(i==="edit-list-button"){this.onEditListClick(h(s,n("list-of-lists-item")));return}if(i==="remove-list-button"){this.onRemoveListClick(h(s,n("list-of-lists-item")));return}}onAddListClick(){const e=c(n("list-input")),s=e.value.trim();s!==""&&(oe({id:$(),name:s,isActive:!0}),v(e))}onEditListClick(e){const s=e==null?void 0:e.dataset.jsListId;if(s){const i=this.state.lists.find(a=>a.id===s);if(i){const a=c(n("list-input"));a.focus(),a.value=i.name;const r=c(n("add-list-button"));r.textContent=o.t("actions.update"),r.dataset.editListId=s}}}onUpdateListClick(e){const s=c(n("list-input"));re({id:e,name:s.value.trim(),isActive:!0});const i=c(n("add-list-button"));i.textContent=o.t("actions.add"),delete i.dataset.editListId,v(s)}onRemoveListClick(e){const s=e==null?void 0:e.dataset.jsListId;s&&ne(s)}onItemClick(e){const s=e==null?void 0:e.dataset.jsListId;s&&le(s)}}const f=t=>t.lists.find(e=>e.isActive)||null,ge=t=>{const e=f(t);return e===null?[]:P(t,e.id).filter(s=>!s.completed)},B=t=>{const e=f(t);if(e===null)return[];const{filters:s}=t;return P(t,e.id).filter(i=>{const a=s.status==="all"||s.status==="completed"&&i.completed||s.status==="active"&&!i.completed,r=s.priority==="all"||i.priority===s.priority;return a&&r})},D=t=>f(t)===null?0:ge(t).length,P=(t,e)=>e===null?[]:t.tasks.filter(s=>s.listId===e);function p({selector:t,label:e,disabled:s,customClass:i,children:a}){return`
        <button ${l("selector",t)} class="px-4 py-1 rounded-md border border-transparent hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-300 active:text-white active:bg-blue-500 dark:active:bg-blue-600 active:border-blue-500 ${i??""}" ${s&&"disabled"}>${e}${a||""}</button>
    `}function ke({disabled:t}){return`${p({selector:"clear-completed-button",label:o.t("tasks.clearCompleted"),disabled:t})}`}const be=t=>`<option value="${t.value}" ${t.selected&&"selected"}>${t.title}</option>`;function N({id:t,label:e,selector:s,options:i}){return`
        <div>
            ${e?`<label for="${t}" class="block mb-2">${e}:</label>`:""}
            <div class="relative">
                <select
                    ${l("selector",s)}
                    id="priority"
                    class="appearance-none w-full p-2 bg-white dark:bg-gray-700 rounded-md border dark:border-gray-600"
                >
                    ${i.map(r=>be(r)).join("")}
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                    <div class="inline-block border-b-black dark:border-b-white border-r-2 border-b-2 p-[3px] rotate-45"></div>
                </div>
            </div>
        </div>
    `}const ve=[{title:o.t("none"),value:"none",selected:!0},...Array.from({length:8},(t,e)=>({title:`${e+1}h`,value:`${e+1}h`,selected:!1})),{title:"1d",value:"1d",selected:!1},{title:"1w",value:"1w",selected:!1},{title:"1m",value:"1m",selected:!1}];function Te(){return`${N({id:"estimated-time",selector:"task-estimate-time-select",label:o.t("tasks.estimateTime"),options:ve})}`}function j({selector:t,checked:e}){return`
        <input ${l("selector",t)} type="checkbox" ${e?"checked":""}
            class="form-checkbox h-6 w-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-600"
        />
    `}function Le({checked:t,disabled:e}){const s=j({selector:"toggle-all-completed-checkbox",checked:t}),i=p({selector:"mark-all-as-completed-button",label:o.t("tasks.completeAll"),disabled:e});return`
        <div class="flex items-center gap-2">
            ${s}
            ${i}
        </div>
    `}function ye({remainingTasksCount:t,completedTasksCount:e,filters:s}){const i=` (<span class="inline-block" ${l("selector","all-tasks-count")}>${t+e}</span>)`,a=` (<span class="inline-block" ${l("selector","remaining-tasks-count")}>${t}</span>)`,r=` (<span class="inline-block" ${l("selector","completed-tasks-count")}>${e}</span>)`,m="bg-gray-200 dark:bg-gray-700";return`
            <div class="flex space-x-4 my-2 sm:my-0">
                ${p({selector:"task-filter-status-all",label:o.t("tasks.filter.all"),customClass:s.status==="all"?m:"",children:i})}

                ${p({selector:"task-filter-status-active",label:o.t("tasks.filter.active"),customClass:s.status==="active"?m:"",children:a})}

                ${p({selector:"task-filter-status-completed",label:o.t("tasks.filter.completed"),customClass:s.status==="completed"?m:"",children:r})}
            </div>
        `}const we={en:"en-GB","pt-br":"pt-BR",es:"es-ES",ua:"uk-UA",ru:"ru-RU"};function Se(t,e="en"){const s=we[e];return new Intl.DateTimeFormat(s,{month:"2-digit",day:"2-digit",year:"2-digit"}).format(t)}function L(t){const e=t.match(/(\d+)(\w+)/);if(!e)return 0;const[,s,i]=e,a={min:1,h:60,d:1440,w:10080,m:43200,y:525600}[i]||0;return parseInt(s)*a}function g({selector:t,title:e,value:s,customClassName:i,titleClassName:a,valueClassName:r}){return`
        <div ${l("selector",t)} class="text-sm text-gray-600 dark:text-gray-400 ${i??""}">
            <span class="${a??""}">${e}:</span>
            <span class="${r??""}">${s}</span>
        </div>
    `}function Ae(t){switch(t){case"high":return"text-red-500 dark:text-red-400";case"medium":return"text-yellow-500 dark:text-yellow-400";case"low":return"text-green-500 dark:text-green-400";default:return"text-gray-500 dark:text-gray-400"}}function Ee({id:t,text:e,completed:s,priority:i,createdAt:a,estimateTime:r}){const m="1h",T=L(m)<=0,w=L(m)>0&&L(m)<60,V=j({selector:"complete-task-checkbox",checked:s});return`
        <li
            ${l("selector","task")} ${l("task-id",t)} draggable="true"
            class="group flex flex-row md:flex-row justify-between items-center md:items-center p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out ${w?"border-l-4 border-red-500":""}"
        >
          <div class="flex items-center gap-4">
            <div class="flex content-center items-center">
                ${V}
            </div>

            <div>
                <p ${l("selector","task-text")} class="font-medium truncate">${e}</p>
                <div class="hidden md:flex justify-between md:space-x-10 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    ${g({selector:"task-priority",title:o.t("tasks.priority.label"),value:o.t(`tasks.priority.${i}`),valueClassName:Ae(i)})}

                        ${g({selector:"task-created-at",title:o.t("tasks.createdAt"),value:Se(new Date(a),d.getState().locale)})}

                        

                        ${g({selector:"task-estimate-time",title:o.t("tasks.estimateTime"),value:r==="none"?o.t(r):r})}

                        ${g({selector:"task-remaining-time",title:o.t("tasks.remainingTime"),value:m,valueClassName:T?"text-red-600 font-semibold":w?"text-orange-600 font-semibold":""})}
                </div>
            </div>
          </div>
          <div class="flex flex-wrap gap-2">
            ${M({selector:"edit-task-button"})}
            ${O({selector:"remove-task-button"})}
          </div>
        </li>
      `}const Ce=[{title:"None",value:"none",selected:!0},{title:"High",value:"high",selected:!1},{title:"Medium",value:"medium",selected:!1},{title:"Low",value:"low",selected:!1}];function $e(){return`${N({id:"priority",selector:"task-priority-select",label:o.t("tasks.priority.label"),options:Ce.map(t=>({...t,title:o.t(`tasks.priority.${t.value}`)}))})}`}class xe{constructor(e){u(this,"state");u(this,"root");u(this,"unsubscribe");u(this,"onClickBinded");this.state=e,this.root=c(n("list-of-tasks-container")),this.onClickBinded=this.onClick.bind(this),this.root.addEventListener("click",this.onClickBinded),this.unsubscribe=d.subscribe(this.updateState.bind(this))}render(){return this.root.innerHTML=`
			${I({selector:"list-of-tasks-title",text:o.t("tasks.tasks"),textSecondPart:this.state.activeList?this.state.activeList.name:o.t("lists.noListSelected")})}

            <div class="flex items-center gap-2 mb-4">
				${R({selector:"task-input",ariaLabel:o.t("tasks.new"),placeholder:o.t("tasks.inputPlaceholder")})}
                ${_({selector:"add-task-button"})}
            </div>

            <div class="flex gap-2 mb-4">
                <div class="flex-1"> ${$e()}</div>
                <div class="flex-1">${Te()}</div>
            </div>


            <div class="flex flex-col sm:flex-row justify-between items-center mb-4 py-4 px-4 rounded-md bg-white dark:bg-gray-800 shadow-md text-sm">
                ${Le({checked:this.state.tasks.filter(e=>e.completed).length===this.state.tasks.length,disabled:this.state.tasks.filter(e=>!e.completed).length===0})}

                ${ye({remainingTasksCount:this.state.remainingTasksCount,completedTasksCount:this.state.tasks.filter(e=>e.completed).length,filters:this.state.filters})}

                ${ke({disabled:this.state.tasks.filter(e=>e.completed).length===0})}
            </div>

            <ul ${l("selector","task-list")} role="list" aria-label="${o.t("tasks.tasks")}" class="space-y-3">
                ${this.state.tasks.map(e=>Ee(e)).join("")}
            </ul>
        `,this.root.innerHTML}destroy(){this.root.removeEventListener("click",this.onClickBinded),this.unsubscribe()}updateState(){const e=d.getState();this.state={...this.state,activeList:f(e),tasks:B(e),remainingTasksCount:D(e),filters:e.filters},this.render()}onClick(e){let s=e.target;if(s&&!s.dataset.jsSelector&&(s=s.closest(`[${y}]`)),!s)return;const i=s.dataset.jsSelector;if(i==="add-task-button"){s.dataset.editTaskId?this.onUpdateTaskClick(s.dataset.editTaskId):this.onAddTaskClick();return}if(i==="edit-task-button"){this.onEditTaskClick(h(s,n("task")));return}if(i==="remove-task-button"){this.onRemoveTaskClick(h(s,n("task")));return}if(i==="complete-task-checkbox"){const a=h(s,n("task")),r=a==null?void 0:a.dataset.jsTaskId;r&&C({id:r,completed:s.checked});return}if(i!=null&&i.startsWith("task-filter-status")){s.classList.toggle("active"),ae(i.split("-").pop()||"all");return}if(i==="toggle-all-completed-checkbox"&&this.state.activeList){he({listId:this.state.activeList.id,checked:s.checked});return}if(i==="mark-all-as-completed-button"&&this.state.activeList){me(this.state.activeList.id);return}if(i==="clear-completed-button"){this.state.activeList&&ue(this.state.activeList.id);return}}onUpdateTaskClick(e){const s=c(n("task-input")),i=c(n("task-priority-select"));C({id:e,text:s.value.trim(),priority:i.value});const a=c(n("add-task-button"));a.textContent=o.t("actions.add"),delete a.dataset.editTaskId,v(s)}onAddTaskClick(){const e=c(n("task-input")),s=e.value.trim(),i=c(n("task-priority-select")).value.trim(),a=c(n("task-estimate-time-select")).value.trim();s!==""&&this.state.activeList!==null&&(ce({id:$(),listId:this.state.activeList.id,text:s,completed:!1,priority:i,createdAt:Date.now(),completedAt:null,estimateTime:a,remainingTime:null,timeSpent:0}),v(e))}onEditTaskClick(e){const s=e==null?void 0:e.dataset.jsTaskId;if(s){const i=this.state.tasks.find(a=>a.id===s);if(i){const a=c(n("task-input")),r=c(n("task-priority-select"));a.focus(),a.value=i.text,r.value=i.priority;const m=c(n("add-task-button"));m.textContent=o.t("actions.update"),m.dataset.editTaskId=s}}}onRemoveTaskClick(e){const s=e==null?void 0:e.dataset.jsTaskId;s&&de(s)}}const _e=t=>d.dispatch({type:"SET_LOCALE",payload:t}),b={en:{title:"English",code:"en",flagSrc:"public/en.svg",flagAlt:o.t("flags.en")},"pt-br":{title:"Português",code:"pt-br",flagSrc:"public/br.svg",flagAlt:o.t("flags.br")},es:{title:"Español",code:"es",flagSrc:"public/es.svg",flagAlt:o.t("flags.es")},ua:{title:"Українська",code:"ua",flagSrc:"public/ua.svg",flagAlt:o.t("flags.ua")},ru:{title:"Русский",code:"ru",flagSrc:"public/ru.svg",flagAlt:o.t("flags.ru")}},Ie=Object.keys(b);class Me{constructor(e){u(this,"state");u(this,"root");u(this,"unsubscribe");u(this,"onToggleButtonClickBinded",this.onToggleButtonClick.bind(this));u(this,"onListClickBinded",this.onListClick.bind(this));this.state=e,this.root=c(n("locale-selector-container")),this.unsubscribe=d.subscribe(this.updateState.bind(this)),e.locale||this.detectUserLocale()}updateState(){this.state={locale:d.getState().locale},this.render()}addListeners(){const e=c(n("locale-list"));e&&e.addEventListener("click",this.onListClickBinded);const s=c(n("locale-selector-button"));s&&s.addEventListener("click",this.onToggleButtonClickBinded)}removeListeners(){const e=c(n("locale-list"));e&&e.removeEventListener("click",this.onListClickBinded);const s=c(n("locale-selector-button"));s&&s.removeEventListener("click",this.onToggleButtonClickBinded)}onListClick(e){const s=c(n("locale-dropdown")),i=h(e.target,n("locale-option")).getAttribute(l("locale"));this.setLocale(i),s.classList.add("hidden")}onToggleButtonClick(){c(n("locale-dropdown")).classList.toggle("hidden")}detectUserLocale(){const e=navigator.language.toLowerCase();let s=this.state.locale;for(const i of Ie)if(e.startsWith(i)){s=i;break}this.setLocale(s)}setLocale(e){this.state.locale=e,document.documentElement.setAttribute("lang",e),_e(e),this.render()}render(){return this.removeListeners(),this.root.innerHTML=this.template(),this.addListeners(),this.root.innerHTML}listItemTemplate({title:e,code:s,flagSrc:i,flagAlt:a}){return`
            <li
                ${l("selector","locale-option")}
                ${l("locale",s)}
                class="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            >
                <img
                    src="${i}"
                    alt="${a}"
                    class="w-6 h-6 mr-2"
                />
                <span>${e}</span>
            </li>
        `}template(){return`
            <div ${l("selector","locale-selector")} class="relative inline-block">
                <button
                    ${l("selector","locale-selector-button")}
                    class="flex items-center mr-4 px-4 py-1 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white focus:outline-none"
                >
                    <span class="mr-2">${this.state.locale.toUpperCase()}</span>
                    <img
                        src="${b[this.state.locale].flagSrc}"
                        alt="${b[this.state.locale].flagAlt}"
                        class="w-8 h-8"
                    />
                    <svg
                        class="ml-2 w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                        ></path>
                    </svg>
                </button>

                <div
                    ${l("selector","locale-dropdown")}
                    class="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10"
                >
                    <ul ${l("selector","locale-list")} class="py-1 text-sm">
                        ${Object.values(b).map(e=>this.listItemTemplate(e)).join(`
`)}
                    </ul>
                </div>
            </div>
        `}destroy(){this.unsubscribe()}}const k=t=>d.dispatch({type:"SET_THEME",payload:t});class Oe{constructor(e){u(this,"state");u(this,"sunIcon",document.createElement("span"));u(this,"moonIcon",document.createElement("span"));u(this,"unsubscribe");this.state=e,this.unsubscribe=d.subscribe(this.updateState.bind(this))}updateState(){const e=d.getState();this.state.theme!==e.theme&&(this.state={...this.state,theme:e.theme},this.render())}setTheme(){const e=window.matchMedia("(prefers-color-scheme: dark)").matches,s=d.getState().theme;s==="dark"||!s&&e?(document.documentElement.classList.add("dark"),k("dark"),this.showDarkThemeIcon()):(document.documentElement.classList.remove("dark"),k("light"),this.showLightThemeIcon()),c(n("theme-toggle-button")).addEventListener("click",()=>{document.documentElement.classList.toggle("dark"),document.documentElement.classList.contains("dark")?(this.showDarkThemeIcon(),k("dark")):(this.showLightThemeIcon(),k("light"))})}showLightThemeIcon(){this.sunIcon.classList.remove("hidden"),this.moonIcon.classList.add("hidden")}showDarkThemeIcon(){this.sunIcon.classList.add("hidden"),this.moonIcon.classList.remove("hidden")}template(){return`
            <button
                ${l("selector","theme-toggle-button")}
                aria-label=${o.t("toggleTheme")}
                class="w-10 h-10 rounded-full shadow-md bg-gray-300 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-400"
            >
                <span
                    ${l("selector","light-theme-icon")}
                    class="text-lg"
                    role="img"
                    aria-label=${o.t("sun")}
                    >☀️</span
                >
                <span
                    ${l("selector","dark-theme-icon")}
                    class="text-lg"
                    role="img"
                    aria-label=${o.t("moon")}
                    >🌙</span
                >
            </button>
        `}render(){const e=c(n("theme-toggle-container"));return e.innerHTML=this.template(),this.sunIcon=c(n("light-theme-icon")),this.moonIcon=c(n("dark-theme-icon")),this.setTheme(),e.innerHTML}destroy(){this.unsubscribe()}}document.addEventListener("DOMContentLoaded",()=>{const t=d.getState();new Me({locale:t.locale}).render(),new Oe({theme:t.theme}).render(),new fe({lists:t.lists}).render(),new xe({activeList:f(t),tasks:B(t),remainingTasksCount:D(t),filters:t.filters}).render()});
