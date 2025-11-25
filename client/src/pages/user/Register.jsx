import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from 'sonner';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";

import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/components/ui/card";


import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { registerSchema } from "@/lib/validation/registerSchema.js";
import { regService } from "../../services/authServices";

import { useAreas } from "../../context/AreaContext";

import AreaMultiSelect from "../../components/area/AreaMultiSelect";


const Register = () => {
  // State to track selected role
  const [role, setRole] = useState("user");

  // use global areas here
  const { areas, loadingAreas } = useAreas();


  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);



  // Initialize form with validation
  const form = useForm({
    resolver: zodResolver(registerSchema(role)), // dynamic validation
    defaultValues: {
      role: "user",
      name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone: "",
      address: "",
      service_areas: [],
      image: null,

    },
  })

  // Handle form submit
  const onSubmit = (values) => {
    const formData = new FormData();
    // Append all normal fields
    formData.append("role", values.role);
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("confirm_password", values.confirm_password);
    formData.append("phone", values.phone);
    formData.append("address", values.address);
    // Provider service areas (array)
    if (Array.isArray(values.service_areas)) {
      values.service_areas.forEach((area) => {
        formData.append("service_areas[]", area);
      });
    }

    // Image (optional)    
    if (values.image) {
      formData.append("image", values.image);
    } else {
      console.log("NO IMAGE FOUND");
    }
    // for (let pair of formData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }



    // regService(values).then((res) => {
    regService(formData).then((res) => {
      console.log(res);
      if (res.status === 201) {
        toast.success("Sign up successful!");
        form.reset();  //  <-- Clears all fields
        setRole("user"); //reset role too
        setImagePreview(null)
        // force reset file input visually
        document.getElementById("profile-upload").value = "";
        
      }
    }).catch((error) => {
      // console.log(error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.error || "Sign up failed");
      } else {
        toast.error("Something went wrong. Please try again.");
      }

    })
    // console.log("Form Data:", values, formData);
    // axios.post("/api/register", values)
  };



  return (

    <div className="min-h-screen flex justify-center items-center p-4">
      <Card className="p-6 w-full max-w-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Registration Form
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* ROLE RADIO BUTTONS */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (


                  <FormItem>
                    <FormLabel>Select Role</FormLabel>

                    <div className="flex gap-6 mt-2">
                      {/* USER RADIO */}
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="user"
                          checked={role === "user"}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setRole(e.target.value);
                          }}
                        />
                        User
                      </label>

                      {/* PROVIDER RADIO */}
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="provider"
                          checked={role === "provider"}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                            setRole(e.target.value);
                          }}
                        />
                        Provider
                      </label>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* COMMON FIELDS */}
              {["name", "email", "password", "confirm_password", "phone", "address"].map((item) => (
                <FormField
                  key={item}
                  control={form.control}
                  name={item}
                  render={({ field }) => (
                    <FormItem>

                      <FormLabel className="capitalize">{item.replace("_", " ")}</FormLabel>
                      <Input
                        type={item.includes("password") ? "password" : "text"}
                        placeholder={`Enter ${item.replace("_", " ")}`}
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              {/* PROVIDER EXTRA FIELDS */}
              {role === "provider" && (
                <>
                  <FormField
                    control={form.control}
                    name="service_areas"
                    render={({ field }) => (
                      <FormItem >
                        <FormLabel>Service Areas</FormLabel>
                        {
                          loadingAreas
                            ? (<p>Loading areas...</p>)
                            : (
                              <AreaMultiSelect
                                areas={areas}
                                value={field.value}
                                onChange={field.onChange}
                              />
                            )
                        }

                        <FormMessage />
                      </FormItem>
                    )}
                  />



                </>
              )}

              {/* PROFILE PICTURE (Optional) */}
              {/* <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture (optional)</FormLabel>

                    <input
                      type="file"
                      accept="image/*"
                      className="border p-2 rounded w-full"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file); // RHF receives file correctly
                      }}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture (optional)</FormLabel>

                    {/* Image preview + remove button */}
                    {imagePreview && (
                      <div className="relative inline-block mb-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-24 h-24 rounded object-cover border"
                        />

                        {/* Remove button (X) */}
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            field.onChange(null);   // remove from form
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    {/* Image Input */}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      id="profile-upload"
                      className="border p-2 rounded w-full"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);

                        if (file) {
                          const url = URL.createObjectURL(file);
                          setImagePreview(url);
                        } else {
                          setImagePreview(null);
                        }
                      }}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              />





              {/* <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture (optional)</FormLabel>



                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);   // update RHF
                      }}
                    />

                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              <Button type="submit" className="w-full">
                Sign up
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="text-sm text-muted-foreground flex items-center justify-center">
          Alredy have an account?
          <Link to="/login" className="text-primary ml-1">
            Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Register