import React, { useEffect } from "react";
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();
  var userState = false;

  useEffect(() => {
    if (userState) {
      navigate("/ordenes");
    }
  });
  const handleSubmit = () => {
    userState = true;
    navigate("/ordenes");
  };
  return (
    <div className="container col-4 mt-4 text-center">
      <h1 className="h3 mb-3">Iniciar sesión</h1>
      <form className="form-signin">
        <div className="form-floating">
          <input
            type="email"
            className="form-control mb-3"
            id="floatingInput"
            placeholder="name@example.com"
          />
          <label htmlFor="floatingInput">Correo Electronico</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control mb-3"
            id="floatingPassword"
            placeholder="Contraseña"
          />
          <label htmlFor="floatingPassword">Contraseña</label>
          <div className="text-end">
            <a href="/recoverypassword" className="link-primary">
              Recuperar contraseña
            </a>
          </div>
          <button
            onClick={handleSubmit}
            className="btn-lg btn-primary w-100 my-4"
          >
            Iniciar sesión
          </button>
        </div>
      </form>
      <p className="m-0">
        ¿Aun no tienes cuenta?{" "}
        <a href="/signup" className="link-primary text-end m-0">
          Registrate aquí
        </a>
      </p>
    </div>
  );
}
