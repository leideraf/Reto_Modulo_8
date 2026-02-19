import { useState, useCallback } from "react";

/**
 * ============================================
 * REGLAS DE VALIDACIÓN POR CAMPO
 * ============================================
 * Cada propiedad representa un campo del formulario
 * y retorna un mensaje de error si la validación falla.
 * Si no hay error, retorna una cadena vacía.
 */
const validationRules = {
  /**
   * Valida el nombre de usuario
   */
  username: (value) => {
    if (!value || value.trim() === "") {
      return "El nombre de usuario es obligatorio.";
    }
    return "";
  },

  /**
   * Valida el email usando una expresión regular
   */
  email: (value) => {
    if (!value || value.trim() === "") {
      return "El email es obligatorio.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "El email no es válido.";
    }

    return "";
  },

  /**
   * Valida la contraseña según reglas de seguridad
   */
  password: (value) => {
    if (!value) {
      return "La contraseña es obligatoria.";
    }
    if (value.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return "La contraseña debe contener al menos una letra minúscula.";
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return "La contraseña debe contener al menos una letra mayúscula.";
    }
    if (!/(?=.*\d)/.test(value)) {
      return "La contraseña debe contener al menos un número.";
    }
    return "";
  },

  /**
   * Valida que la confirmación coincida con la contraseña original
   */
  confirmPassword: (value, originalPassword) => {
    if (!value) {
      return "La confirmación de contraseña es obligatoria.";
    }
    if (value !== originalPassword) {
      return "Las contraseñas no coinciden.";
    }
    return "";
  },
};

/**
 * ============================================
 * HOOK PERSONALIZADO: useFormValidation
 * ============================================
 * Maneja:
 * - Estado del formulario
 * - Validaciones en tiempo real
 * - Errores
 * - Campos tocados (touched)
 * - Reset del formulario
 *
 * @param {Object} initialValues Valores iniciales del formulario
 * @returns Funciones y estados del formulario
 */
const useFormValidation = (initialValues = {}) => {
  /**
   * Estado de los valores del formulario
   */
  const [values, setValues] = useState(initialValues);

  /**
   * Estado de los errores por campo
   */
  const [errors, setErrors] = useState({});

  /**
   * Estado que indica si un campo fue tocado
   */
  const [touched, setTouched] = useState({});

  /**
   * ============================================
   * Valida un campo individual
   * ============================================
   * @param {string} name Nombre del campo
   * @param {any} value Valor del campo
   * @param {Object} allValues Valores completos del formulario
   * @returns {string} Mensaje de error o vacío
   */
  const validateField = useCallback(
    (name, value, allValues = values) => {
      let error = "";

      if (validationRules[name]) {
        if (name === "confirmPassword") {
          error = validationRules[name](value, allValues.password);
        } else {
          error = validationRules[name](value);
        }
      }

      return error;
    },
    [values]
  );

  /**
   * ============================================
   * Maneja el cambio de un campo
   * ============================================
   * Actualiza valores y valida si el campo ya fue tocado
   */
  const handleChange = useCallback(
    (name, value) => {
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (touched[name]) {
        const newValues = { ...values, [name]: value };
        const error = validateField(name, value, newValues);

        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [touched, values, validateField]
  );

  /**
   * ============================================
   * Maneja el evento blur (cuando se sale del input)
   * ============================================
   */
  const handleBlur = useCallback(
    (name) => {
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      const error = validateField(name, values[name]);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    },
    [values, validateField]
  );

  /**
   * ============================================
   * Valida todo el formulario
   * ============================================
   * Útil al enviar el formulario
   */
  const validateAll = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(values).forEach((name) => {
      const error = validateField(name, values[name]);
      newErrors[name] = error;

      if (error) {
        isValid = false;
      }
    });

    setErrors(newErrors);

    // Marca todos los campos como tocados
    setTouched(
      Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );

    return isValid;
  }, [values, validateField]);

  /**
   * ============================================
   * Reinicia el formulario
   * ============================================
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  /**
   * ============================================
   * Retorna las props necesarias para un input
   * ============================================
   * Simplifica el uso en componentes
   */
  const getFieldProps = useCallback(
    (name) => {
      const hasError = touched[name] && errors[name];
      const isValid = touched[name] && !errors[name] && values[name];
      const isPristine = !touched[name];

      return {
        value: values[name] || "",
        onChange: (e) => handleChange(name, e.target.value),
        onBlur: () => handleBlur(name),

        className: `
          w-full px-4 py-2 border rounded-lg 
          focus:outline-none focus:ring-2 
          ${
            hasError
              ? "border-red-500 focus:ring-red-500"
              : isValid
              ? "border-green-500 focus:ring-green-500"
              : "border-blue-100 focus:ring-blue-500"
          }
        `,

        error: hasError ? errors[name] : "",
        isValid,
        isPristine,
        hasError,
      };
    },
    [values, errors, touched, handleChange, handleBlur]
  );

  /**
   * ============================================
   * API pública del hook
   * ============================================
   */
  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    getFieldProps,
  };
};

export default useFormValidation;