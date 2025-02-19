"use client";

import React from 'react';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from './ui/drawer';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountSchema } from '@/app/lib/schema';
import { Input } from './ui/input';


const CreateAccountDrawer = ({children}) => {
    const [open, setOpen] = useState(false);

    const {register, 
      handleSubmit, 
      formState:{errors},
      setValue,
      watch,
      reset,
    } = useForm({
      resolver:zodResolver(accountSchema),
      defaultValues: {
        name: "",
        type: "CURRENT",
        balance: "",
        isDefault: false,
      },
    });


  return (
    <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger  asChild>{children}</DrawerTrigger>
        <DrawerContent>
            <DrawerHeader>
            <DrawerTitle>Create New Account</DrawerTitle>
            </DrawerHeader>
            <div>
                <form>
                  <div>
                    <label htmlFor="name" className='text-sm font-kedium'>Create New Account</label>
                    <Input 
                    id="name" placeholder="e.g., Main Checking"
                    {...register("name")}
                    />
                    {errors.name &&(
                      <p className='text-sm text-red-500'>{errors.name.message}</p>
                    )}
                  </div>


                </form>
            </div>
        </DrawerContent>
    </Drawer>

  )
}

export default CreateAccountDrawer;
