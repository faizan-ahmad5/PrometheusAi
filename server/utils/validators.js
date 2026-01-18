// Input validation utilities for consistent error handling

export const validators = {
  // Validate MongoDB ObjectId
  isValidObjectId: (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  },

  // Validate email format
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  },

  // Validate password strength
  isValidPassword: (password) => {
    // At least 6 characters, includes uppercase, lowercase, number
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return strongRegex.test(password);
  },

  // Validate username
  isValidUsername: (username) => {
    // 3-30 chars, alphanumeric and underscore only
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    return usernameRegex.test(username);
  },

  // Validate chat name
  isValidChatName: (name) => {
    return (
      typeof name === "string" &&
      name.trim().length > 0 &&
      name.trim().length <= 100
    );
  },

  // Validate prompt
  isValidPrompt: (prompt) => {
    return (
      typeof prompt === "string" &&
      prompt.trim().length > 0 &&
      prompt.trim().length <= 5000
    );
  },

  // Sanitize input (basic XSS prevention)
  sanitizeString: (str) => {
    if (typeof str !== "string") return "";
    return str
      .replace(/[<>\"']/g, (char) => {
        const htmlMap = {
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#x27;",
        };
        return htmlMap[char];
      })
      .trim();
  },
};

// Validation middleware factory
export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      for (const [field, validator] of Object.entries(schema)) {
        const value = req.body[field];

        if (!validator(value)) {
          return res.status(400).json({
            success: false,
            message: `Invalid ${field} format`,
            field,
          });
        }
      }
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Request validation failed",
        error: error.message,
      });
    }
  };
};

export default validators;
