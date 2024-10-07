document.addEventListener("DOMContentLoaded", () => {
    const userTableBody = document.getElementById("userTableBody");
    const addUserBtn = document.getElementById("addUserBtn");
    const addUserModal = document.getElementById("addUserModal");
    const editUserModal = document.getElementById("editUserModal");
    const addUserForm = document.getElementById("addUserForm");
    const editUserForm = document.getElementById("editUserForm");
    const closeAddModal = document.querySelector("#addUserModal .close");
    const closeEditModal = document.querySelector("#editUserModal .close");

    let editingUserId = null;

    // Función para obtener usuarios desde el servidor
    function fetchUsers() {
        fetch('http://localhost:5555/rol/all')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los usuarios');
                }
                return response.json();
            })
            .then(data => {
                renderUserTable(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Renderizar la tabla de usuarios
    function renderUserTable(users) {
        userTableBody.innerHTML = "";
        users.forEach(user => {
            const row = `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.descripcion}</td>
                    <td>${user.estado}</td>
                    <td class="modal-actions">
                        <button class="btn-primary" onclick="editUser(${user.id})">Editar</button>
                        <button class="btn-danger" onclick="deleteUser(${user.id})">Eliminar</button>
                    </td>
                </tr>
            `;
            userTableBody.innerHTML += row;
        });
    }

    // Abrir modal para agregar usuario
    addUserBtn.addEventListener("click", () => {
        addUserModal.style.display = "block";
        addUserForm.reset();
        editingUserId = null; // Limpiar el ID al abrir el modal para agregar
    });

    // Cerrar modal para agregar usuario
    closeAddModal.addEventListener("click", () => {
        addUserModal.style.display = "none";
    });

    // Cerrar modal para editar usuario
    closeEditModal.addEventListener("click", () => {
        editUserModal.style.display = "none";
    });

    // Función para obtener datos del usuario para editar
    window.editUser = function(id) {
        fetch(`http://localhost:5555/rol/get/${id}`)
            .then(response => response.json())
            .then(user => {
				let estado;
				if(user.estado == "Activo") 
		        {
		        	estado = 1;
		        }
		        
		        else if (user.estado == "Inactivo") 
		        {
		        	estado = 2;
		        }
				
                // Rellenar el formulario con los datos del usuario
                document.getElementById("editName").value = user.name;
                document.getElementById("editLastname").value = user.descripcion;
                document.getElementById("editaddRole").value = estado;

                editingUserId = user.id;
                editUserModal.style.display = "block";
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Agregar nuevo usuario
    addUserForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const requestData = {
            "name": document.getElementById("addName").value,
            "descripcion": document.getElementById("addLastname").value,
            "estado": document.getElementById("addRole").value
        };
        
        console.log(requestData);

        fetch('http://localhost:5555/rol/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Rol agregado correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    fetchUsers();
                    addUserModal.style.display = "none";
                });
            } else {
                throw new Error('Error al agregar rol');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Actualizar usuario
    editUserForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const requestData = {
            "name": document.getElementById("editName").value,
            "descripcion": document.getElementById("addLastname").value,
            "estado": document.getElementById("editaddRole").value
        };
        
        console.log(requestData);

        fetch(`http://localhost:5555/rol/update/${editingUserId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Roles actualizado correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    fetchUsers();
                    editUserModal.style.display = "none";
                    editingUserId = null; // Limpiar el ID después de la edición
                });
            } else {
                throw new Error('Error al actualizar rol');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Función para eliminar usuario
    window.deleteUser = function(id) {
        fetch(`http://localhost:5555/rol/delete/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Rol eliminado correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    fetchUsers(); // Volver a obtener la lista de usuarios
                });
            } else {
                throw new Error('Error al eliminar rol');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Inicializar la tabla de usuarios
    fetchUsers();
});

async function logout()
{
	const url = 'http://localhost:5555/auth/logout';
	    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            localStorage.removeItem('token');
            
            Swal.fire({
                title: 'Cierre de sesión exitoso',
                text: 'Has cerrado sesión correctamente.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.href = '/login'; // Cambiar según la ruta a la que desees redirigir
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'No se pudo cerrar sesión correctamente.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error inesperado.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        console.error('Error:', error);
    }
}
