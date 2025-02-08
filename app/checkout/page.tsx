"use client";

import React, { useEffect, useState } from 'react'
import { product } from '../../../types/products'
import { getCartItems } from '../actions/actions';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Swal from 'sweetalert2';
import { client } from '@/sanity/lib/client';

const CheckOut = () => {
    const [cartItems, setCartItems] = useState<product[]>([])
    const [discount, setDiscount] = useState<number>(0)
    const [formValues, setFormValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        phone: '',
        zipCode: '',
    })

    const [formErrors, setFormErrors] = useState({
        firstName: false,
        lastName: false,
        email: false,
        address: false,
        city: false,
        phone: false,
        zipCode: false,
    })

    useEffect(() => {
        setCartItems(getCartItems())
        const appliedDiscount = localStorage.getItem('appliedDiscount')
        if (appliedDiscount) {
            setDiscount(Number(appliedDiscount))
        }
    }, [])

    const SubTotal = cartItems.reduce(
        (total, item) => total + item.price * item.inventory, 0
    )

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({
            ...formValues,
            [e.target.id]: e.target.value,
        })
    }

    const validateForm = () => {
        const errors = {
            firstName: !formValues.firstName,
            lastName: !formValues.lastName,
            email: !formValues.email,
            address: !formValues.address,
            phone: !formValues.phone,
            zipCode: !formValues.zipCode,
            city: !formValues.city,

        };
        setFormErrors(errors);
        return Object.values(errors).every((error) => !error);
    }

    const handlePlaceholder = async () => {

        Swal.fire({
            title: 'Processing your order....',
            text: "Please wait ...",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Proceed'
        }).then((result) => {
            if (result.isConfirmed) {
                if (validateForm()) {
                    localStorage.removeItem("appliedDiscount");
                    Swal.fire(
                        "Success",
                        "Your order has been Successfully Proceed",
                        "success",
                    );
                } else {
                    Swal.fire(
                        "Error",
                        "Please fill in all required fields before continuing",
                        "error",
                    );
                }
            }
        });

        const orderData = {
            _type: 'order',
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            email: formValues.email,
            address: formValues.address,
            city: formValues.city,
            phone: formValues.phone,
            zipCode: formValues.zipCode,
            cartItems: cartItems.map(item => ({
                _type: 'reference',
                _ref: item._id
            })),
            total: SubTotal,
            discount: discount,
            orderDate: new Date().toISOString
        };

        try {
            await client.create(orderData)
            localStorage.removeItem("appliedCustomer")
        } catch (error) {
            console.error("Error creating", error);
        }
    }
    return (
        <div className='min-h-screen bg-[#F5F5F5]'>
            <div className=''>
                <div className=' max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <nav className='flex items-center gap-2 py-4'>
                        <Link href={"/cart"}
                            className='text-[#666666] hover:text-black transition text-sm'
                        >
                            Cart
                        </Link>
                        <ChevronRight />
                        <span>
                            CheckOut
                        </span>
                    </nav>
                </div>
            </div>
            <div className='max-w-6xl mx-auto px-4 sm:px-4 lg:px-8 py-12'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                    <div className=' bg-white border rounded-lg p-6 space-y-6 '>
                        <h2 className=' text-lg font-bold mb-4'>
                            Order Summary
                        </h2>
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <div key={item._id} className='flex items-center gap-4 py-3 border-b'>
                                    <div className='w-16 h-16 rounded overflow-hidden'>
                                        {item.image?.asset && (
                                            <Image
                                                src={urlFor(item.image).url()}
                                                alt='iamge'
                                                width={50}
                                                height={50}
                                                className='object-cover w-full h-full'
                                            />
                                        )}
                                    </div>
                                    <div className='flex-1 '>
                                        <h3 className='text-sm font-medium'>
                                            {item.productName}
                                        </h3>
                                        <p className='text-sm text-gray-500'>Quantity : {item.inventory}</p>
                                    </div>
                                    <p>
                                        ${item.price * item.inventory}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className='text-sm font-medium'>Cart is Empty</p>
                        )}
                        <div className='text-right pt-4'>
                            <p className='text-sm'>
                                SubTotal
                                <span className='font-medium'>
                                    : ${SubTotal}
                                </span>
                            </p>
                            <p className='text-sm '>
                                Discount
                                <span className='font-medium'>
                                    : ${discount}
                                </span>
                            </p>
                            <p className='text-lg font-semibold'>
                                Total : ${SubTotal.toFixed(2)}
                            </p>
                        </div>
                    </div>
                    {/* //Billing Form */}
                    <div className=' bg-white border rounded-lg p-4 space-y-6'>
                        <h2 className='text-xl font-semibold'>Billing Information</h2>
                        <div className=' grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div >
                                <label htmlFor='firstName'> First Name  </label>
                                <input
                                    className='border'
                                    id='firstName'
                                    placeholder='Enter your first name'
                                    value={formValues.firstName}
                                    onChange={handleInputChange}
                                />
                                {formErrors.firstName && (
                                    <p className='text-red-500'>First name is required</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor='lastName'> Last Name  </label>
                                <input
                                    className='border'
                                    id='lastName'
                                    placeholder='Enter your last name'
                                    value={formValues.lastName}
                                    onChange={handleInputChange}
                                />
                                {formErrors.lastName && (
                                    <p className='text-red-500'>Last name is required</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor='address'> Address  </label>
                                <input
                                    className='border'
                                    id='address'
                                    placeholder='Enter your address'
                                    value={formValues.address}
                                    onChange={handleInputChange}
                                />
                                {formErrors.address && (
                                    <p className='text-red-500'>Address is required</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor='email'> Email  </label>
                                <input
                                    className='border'
                                    id='email'
                                    placeholder='Enter your email'
                                    value={formValues.email}
                                    onChange={handleInputChange}
                                />
                                {formErrors.email && (
                                    <p className='text-red-500'>Email is required</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor='phone'> Phone  </label>
                                <input
                                    className='border'
                                    id='phone'
                                    placeholder='Enter your phone number'
                                    value={formValues.phone}
                                    onChange={handleInputChange}
                                />
                                {formErrors.phone && (
                                    <p className='text-red-500'>Phone number is required</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor='zipCode'> Zip Code  </label>
                                <input
                                    className='border'
                                    id='zipCode'
                                    placeholder='Enter your zip code'
                                    value={formValues.zipCode}
                                    onChange={handleInputChange}
                                />
                                {formErrors.zipCode && (
                                    <p className='text-red-500'>Zip Code is required</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor='city'> City  </label>
                                <input
                                    className='border'
                                    id='city'
                                    placeholder='Enter your city'
                                    value={formValues.city}
                                    onChange={handleInputChange}
                                />
                                {formErrors.city && (
                                    <p className='text-red-500'>City is required</p>
                                )}
                            </div>
                            <Button
                                className=' w-full h-12 bg-blue-500 hover:bg-blue-700 text-white'
                                onClick={handlePlaceholder}>
                                Place Order
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckOut