// components/AuthForm.js

import React from "react";
import { View } from "react-native";
import Input from "./Input";
import Button from "./Button";
const AuthForm = ({ fields, onSubmit, submitText }) => {
  return (
    <View>
      {fields.map((field, index) => (
        <Input
          key={index}
          label={field.label}
          placeholder={field.placeholder}
          secureTextEntry={field.secureTextEntry}
        />
      ))}
      <Button title={submitText} onPress={onSubmit} />
    </View>
  );
};

export default AuthForm;
