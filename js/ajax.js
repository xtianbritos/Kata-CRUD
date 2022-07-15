const d = document,
    $table = d.querySelector(".crud-table"),
    $form = d.querySelector(".crud-form"),
    $title = d.querySelector(".crud-title"),
    $template = d.querySelector("#crud-template").content,
    $fragment = d.createDocumentFragment();

    const ajax = (options) => {
    let {url, method, sucess, error, data} = options;
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", e=>{
        if(xhr.readyState !== 4) return;

        if(xhr.status >= 200 && xhr.status < 300){
            let json = JSON.parse(xhr.responseText);
            sucess(json);
        }else{
            let message = xhr.statusText || "Ocurrió un error";
            error(`Error ${xhr.status}: ${message}`);
        }
    });

    xhr.open(method || "GET", url);
    xhr.setRequestHeader("Content-type", "application/json; charset=utf-8");
    xhr.send(JSON.stringify(data));
    }

    const getAll = () => {
        ajax({
            url: "http://localhost:5555/santos",
            sucess: (res) => {
                console.log(res);

                res.forEach(el => {
                    $template.querySelector(".name").textContent = el.nombre;
                    $template.querySelector(".constellation").textContent = el.constelacion;
                    $template.querySelector(".edit").dataset.id = el.id;
                    $template.querySelector(".edit").dataset.name = el.nombre;
                    $template.querySelector(".edit").dataset.constellation = el.constelacion;
                    $template.querySelector(".delete").dataset.id = el.id;

                    let $clone = d.importNode($template, true);
                    $fragment.appendChild($clone);
                });

                $table.querySelector("tbody").appendChild($fragment);
            },
            error: (err) => {
                console.log(err);
                $table.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`);
            }
        })
    }

    d.addEventListener("DOMContentLoaded", getAll);

    d.addEventListener("submit", e => {
        if(e.target === $form){
            e.preventDefault();

            if(!e.target.id.value){
                //Create - POST
                ajax({
                    url: "http://localhost:5555/santos",
                    method: "POST",
                    sucess: (res) => location.reload(),
                    error: () => $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
                    data: {
                        nombre: e.target.nombre.value,
                        constelacion: e.target.constelacion.value
                    }
                });
            }else{
                //Update - PUT
                ajax({
                    url: `http://localhost:5555/santos/${e.target.id.value}`,
                    method: "PUT",
                    sucess: (res) => location.reload(),
                    error: () => $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
                    data: {
                        nombre: e.target.nombre.value,
                        constelacion: e.target.constelacion.value
                    }
                });
            }
        }
    });

    d.addEventListener("click", e => {
        if(e.target.matches(".edit")){
            $title.textContent = "Editar Santo";
            $form.nombre.value = e.target.dataset.name;
            $form.constelacion.value = e.target.dataset.constellation;
            $form.id.value = e.target.dataset.id;
        }

        if(e.target.matches(".delete")){
            let isDelete = confirm(`¿Estás seguro de eliminar el id ${e.target.dataset.id}?`);
            if(isDelete){
                //Delete - DELETE
                ajax({
                    url: `http://localhost:5555/santos/${e.target.dataset.id}`,
                    method: "DELETE",
                    sucess: (res) => location.reload(),
                    error: () => alert(err)
                });
            }
        }
    })