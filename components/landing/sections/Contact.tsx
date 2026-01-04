'use client';

import { useState, FormEvent } from 'react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });

      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="bg-white box-border flex flex-col gap-10 md:gap-16 lg:gap-20 items-center justify-center left-0 px-4 sm:px-8 md:px-12 lg:px-[120px] py-12 sm:py-16 md:py-20 lg:py-[112px] w-full">
      <div className="flex flex-col gap-4 md:gap-6 items-center leading-[0] relative shrink-0 text-center w-full max-w-[1280px]">
        <div className="font-['Inter',sans-serif] font-bold not-italic relative shrink-0 text-[0px] text-neutral-950 tracking-[-0.96px]">
          <p className="leading-[normal] mb-0 text-3xl sm:text-4xl lg:text-5xl">Contact Us at</p>
          <p className="font-['Inter',sans-serif] font-normal italic leading-[normal] text-3xl sm:text-4xl lg:text-5xl">
            <span className="text-blue-600">Site</span>
            <span className="text-green-600">Built</span>
          </p>
        </div>
        <div className="flex-[1_0_0] font-['Open_Sans',sans-serif] font-normal leading-[normal] min-h-px min-w-px relative shrink-0 text-[#717182] text-base md:text-lg w-full max-w-[768px] whitespace-pre-wrap">
          <p className="mb-0">Tell us as much detail as possible so we </p>
          <p>can route your message to the right team.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white border border-[rgba(0,0,0,0.1)] border-solid box-border flex flex-col items-center p-6 md:p-8 lg:p-[33px] relative rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] shrink-0 w-full max-w-[566px]">
        <div className="relative shrink-0 w-full">
          <div className="flex flex-col gap-6 items-center relative w-full">
            {/* Full Name */}
            <div className="flex flex-col gap-3 md:gap-4 items-start relative shrink-0 w-full">
              <label htmlFor="name" className="flex gap-2 h-auto md:h-[14px] items-center relative shrink-0 w-full">
                <span className="font-['Arial',sans-serif] leading-[14px] not-italic relative shrink-0 text-xs md:text-sm text-neutral-950">
                  Full Name
                </span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="border border-[rgba(0,0,0,0.2)] border-solid box-border flex h-9 items-center overflow-clip px-3 py-1 relative rounded-[8px] shrink-0 w-full font-['Arial',sans-serif] text-xs md:text-sm text-neutral-950 placeholder:text-[#717182] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-3 md:gap-4 items-start relative shrink-0 w-full">
              <label htmlFor="email" className="flex gap-2 h-auto md:h-[14px] items-center relative shrink-0 w-full">
                <span className="font-['Arial',sans-serif] leading-[14px] not-italic relative shrink-0 text-xs md:text-sm text-neutral-950">
                  Email Address
                </span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@company.com"
                className="bg-white border border-[rgba(0,0,0,0.2)] border-solid box-border flex h-9 items-center overflow-clip px-3 py-1 relative rounded-[8px] shrink-0 w-full font-['Arial',sans-serif] text-[14px] text-neutral-950 placeholder:text-[#717182] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
              <label htmlFor="subject" className="flex gap-2 h-[14px] items-center relative shrink-0 w-full">
                <span className="font-['Arial',sans-serif] leading-[14px] not-italic relative shrink-0 text-[14px] text-neutral-950">
                  Subject
                </span>
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="How can we help?"
                className="bg-white border border-[rgba(0,0,0,0.2)] border-solid box-border flex h-9 items-center overflow-clip px-3 py-1 relative rounded-[8px] shrink-0 w-full font-['Arial',sans-serif] text-[14px] text-neutral-950 placeholder:text-[#717182] focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
              <label htmlFor="message" className="flex gap-2 h-[14px] items-center relative shrink-0 w-full">
                <span className="font-['Arial',sans-serif] leading-[14px] not-italic relative shrink-0 text-[14px] text-neutral-950">
                  Message
                </span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell us more about your inquiry..."
                rows={5}
                className="bg-white border border-[rgba(0,0,0,0.2)] border-solid box-border flex items-start overflow-clip px-3 py-2 relative rounded-[8px] shrink-0 w-full font-['Arial',sans-serif] leading-[20px] text-[14px] text-neutral-950 placeholder:text-[#717182] resize-none focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Status Messages */}
            {status === 'success' && (
              <div className="w-full p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-['Arial',sans-serif] text-sm text-green-800 text-center">
                  ✓ Message sent successfully! We'll get back to you soon.
                </p>
              </div>
            )}
            {status === 'error' && (
              <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-['Arial',sans-serif] text-sm text-red-800 text-center">
                  ✗ {errorMessage}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-blue-600 box-border flex gap-[10px] h-[60px] items-center justify-center px-5 py-[10px] relative rounded-[30px] shrink-0 w-full transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 disabled:hover:shadow-none"
            >
              <p className="font-['Inter',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-sm md:text-base text-white">
                {status === 'loading' ? 'Sending...' : 'Send Message'}
              </p>
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}

