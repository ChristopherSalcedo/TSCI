import React, { useEffect, useState } from "react";
import { Formik, Form, Field /* , ErrorMessage  */ } from "formik";
import * as Yup from "yup";
import { useOrders } from "../context/ordersContext.js";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export function FormOrder() {
  const {
    createOrder,
    getOrder,
    updateOrder,
    deleteOrder,
    testOrder,
    deleteTmp,
  } = useOrders();
  const navigate = useNavigate();
  const params = useParams();

  const [order, setOrder] = useState({
    owner: "",
    description: {
      specs: "",
      no_pieces: "",
    },
    blueprints: null,
  });
  useEffect(() => {
    (async () => {
      if (params.id) {
        const res = await getOrder(params.id);
        setOrder(res);
        const btn = document.getElementById("btn-delete");
        btn.style.display = "inline";
      }
    })();
  }, [params.id, getOrder]);

  const handleDelete = () => {
    toast((t) => (
      <span>
        ¿Deseas <b>eliminar</b> esta orden?
        <div className="mt-2 d-flex justify-content-center">
          <button
            className="btn btn-danger me-3"
            onClick={async () => {
              try {
                await deleteOrder(params.id);
                toast.success("La orden a sido eliminada exitosamente");
                toast.dismiss(t.id);
                navigate("/");
              } catch (error) {
                toast.error("No se a podido eliminar la  orden");
                toast.dismiss(t.id);
              }
            }}
          >
            Eliminar
          </button>
          <button
            className="btn btn-primary"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancelar
          </button>
        </div>
      </span>
    ));
  };

  return (
    <div className="container-sm col-6">
      <Formik
        initialValues={order}
        validationSchema={Yup.object({
          owner: Yup.string().required("El nombre del cliente es requerido"),
          description: Yup.object().shape({
            specs: Yup.string().required(
              "Las especificaciones de la orden son requeridas"
            ),
            no_pieces: Yup.number().required(
              "El numero de piezas de la orden es requerido"
            ),
          }),
        })}
        onSubmit={async (values, actions) => {
          // const files = document.getElementById('formFileMultiple')
          // console.log(values);
          if (params.id) {
            try {
              await updateOrder(params.id, values);
              toast.success("La orden se a guardado exitosamente");
              navigate("/");
            } catch (error) {
              toast.error("No se a podido actualizar la orden");
            }
          } else {
            try {
              await toast.promise(createOrder(values), {
                loading: "Cargando...",
                success: "La orden se a guardado exitosamente",
                error: "No se a podido completar el registro de la orden",
              });
              
              if(values.blueprints?._id){
                const status = await deleteTmp(values.blueprints._id);
                console.log(status);
              }
              navigate("/");
            } catch (error) {
              console.log(error);
              toast.error("No se a podido completar el registro de la orden");
            }
          }
        }}
        enableReinitialize
      >
        {({ handleSubmit, setFieldValue }) => (
          <Form
            onSubmit={handleSubmit}
            className="container-sm border border-ligth mt-4 p-3"
            encType="multipart/form-data"
            method="post"
          >
            <label htmlFor="owner" className="form-label fw-bold">
              Nombre del cliente
            </label>
            <Field
              id="owner"
              className="form-control mb-3"
              name="owner"
              placeholder="Cliente"
              required
            />
            <label htmlFor="specs" className="form-label fw-bold">
              Decripción
            </label>
            <Field
              id="specs"
              component="textarea"
              className="form-control mb-3"
              name="description.specs"
              placeholder="Especificaciones"
              required
            />
            <label htmlFor="no_pieces" className="form-label fw-bold">
              Numero de piezas
            </label>
            <Field
              id="no_pieces"
              className="form-control mb-3"
              name="description.no_pieces"
              placeholder="Numero de piezas"
              type="number"
              required
            />
            <div className="mb-3">
              <label htmlFor="blueprints" className="form-label fw-bold">
                Planos
              </label>
              <div className="input-group">
                <input
                  className="form-control"
                  type="file"
                  name="mFiles"
                  id="input-files"
                  multiple
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (files) {
                      const btn = document.getElementById("input-delete");
                      btn.style.display = "inline";
                    }
                    const tempPaths = await testOrder(files);
                    setFieldValue("blueprints", tempPaths.data);
                  }}
                />
                <button
                  id="input-delete"
                  type="button"
                  className="btn-close m-auto ps-3"
                  style={{ display: "none" }}
                  onClick={() => {
                    const inp = document.getElementById("input-files");
                    inp.value = "";
                    const btn = document.getElementById("input-delete");
                    btn.style.display = "none";
                  }}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary col-3">
                Guardar
              </button>
              <button
                id="btn-delete"
                type="button"
                className="btn btn-danger col-3 ms-3"
                style={{ display: "none" }}
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
