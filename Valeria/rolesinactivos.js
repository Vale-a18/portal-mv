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
        fetch('http://localhost:5555/rol/all/inactivos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los roles');
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
                        <button class="btn-danger" onclick="activateUser(${user.id})">Activar</button>
                    </td>
                </tr>
            `;
            userTableBody.innerHTML += row;
        });
    }

    // Función para activar usuario
    window.activateUser = function(id) {
        fetch(`http://localhost:5555/rol/activate/${id}`, {
            method: 'POST'
        })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Rol activado correctamente',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                }).then(() => {
                    fetchUsers(); // Volver a obtener la lista de usuarios
                });
            } else {
                throw new Error('Error al activar el rol');
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
