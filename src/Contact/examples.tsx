/**
 * Example: Using Contact Global in a Contact Page
 *
 * This file demonstrates how to use the Contact global components
 * in a typical contact page layout.
 */

import { ContactInfo, SocialLinks } from '@/Contact/Component'
import React from 'react'

export default async function ContactPageExample() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Get in Touch</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Information Section */}
        <div className="bg-card p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <ContactInfo
            showAddress={true}
            showEmail={true}
            showPhone={true}
            showBusinessHours={true}
          />
        </div>

        {/* Social Media Section */}
        <div className="bg-card p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Follow Us</h2>
          <SocialLinks iconSize="lg" showLabels={true} className="flex-col items-start" />
        </div>
      </div>
    </div>
  )
}

/**
 * Example: Using Contact Global in a Footer
 */

export async function FooterExample() {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ContactInfo
              showAddress={true}
              showEmail={false}
              showPhone={false}
              showBusinessHours={false}
            />
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4">Contact</h3>
            <ContactInfo
              showAddress={false}
              showEmail={true}
              showPhone={true}
              showBusinessHours={false}
            />
          </div>

          {/* Social */}
          <div>
            <h3 className="font-bold mb-4">Follow Us</h3>
            <SocialLinks iconSize="md" />
          </div>
        </div>
      </div>
    </footer>
  )
}

/**
 * Example: Using Contact Data Directly
 */

import { getContactData } from '@/Contact/Component'

export async function CustomContactComponent() {
  const contact = await getContactData()

  return (
    <div className="text-center p-8">
      <h2 className="text-3xl font-bold mb-4">Questions?</h2>
      <p className="text-lg mb-4">
        Email us at{' '}
        <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">
          {contact.email}
        </a>
      </p>
      {contact.phone && (
        <p className="text-lg">
          Or call us at{' '}
          <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
            {contact.phone}
          </a>
        </p>
      )}
    </div>
  )
}

/**
 * Example: CTA Block with Contact Link
 */

import { ContactPageLink } from '@/Contact/Component'

export async function CTABlockExample() {
  const contact = await getContactData()

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-12 rounded-lg text-center">
      <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
      <p className="text-xl mb-6">Let's discuss your project today</p>
      <div className="flex gap-4 justify-center">
        <ContactPageLink
          className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          label="Contact Us"
        />
        <a
          href={`mailto:${contact.email}`}
          className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
        >
          Email Us
        </a>
      </div>
    </div>
  )
}
