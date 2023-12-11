'use client';
import Button from "@/app/components/Button";
import {useWideHeader} from "@/app/hooks/AppContext";
import axios from "axios";
import {useEffect, useState} from "react";

export default function Pricing() {
  useWideHeader();
  const [isPremium,setIsPremium] = useState(null);

  useEffect(() => {
    axios.get('/api/subscription')
      .then(res => {
        setIsPremium(res.data?.stripeSubscriptionData?.object?.status === 'active');
      })
      .catch(err => {
        console.log(err);
        if (err.response.status === 401) {
          // nothing
        }
      });
  }, []);

  function handleUpgradeButtonClick() {
    axios.post('/api/subscription').then(res => {
      window.location.href = res.data;
    });
  }
  function handleManageButtonClick() {
    axios.post('/api/portal').then(res => {
      window.location.href = res.data;
    });
  }
  return (
    <section className="my-16">
      <h1 className="text-center text-4xl mb-8">Simple pricing</h1>
      <p className="text-center mb-4">Start for free, upgrade when you need</p>
      <div className="grid grid-cols-1 md:grid-cols-none md:flex w-full justify-center gap-2 md:gap-8">
        <div className="flex items-center gap-1 grow md:grow-0 justify-center">
          <div className="bg-indigo-300 w-6 h-6 rounded-full flex items-center justify-center">✓</div>
          Unlimited users
        </div>
        <div className="flex items-center gap-1 grow md:grow-0 justify-center">
          <div className="bg-indigo-300 w-6 h-6 rounded-full flex items-center justify-center">✓</div>
          Unlimited content
        </div>
        <div className="flex items-center gap-1 grow md:grow-0 justify-center">
          <div className="bg-indigo-300 w-6 h-6 rounded-full flex items-center justify-center">✓</div>
          Unlimited admins
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8 mt-8 md:mt-16 text-center md:text-left">
        <div className="bg-indigo-300 bg-opacity-50 rounded-lg p-8">
          <h2 className="text-3xl">Free Forever</h2>
          <p className="mb-3">Just the basics</p>
          <h3 className="text-xl">
            <span className="font-bold text-4xl">$0</span>
            /month
          </h3>
          <ul className="mt-6 inline-block">
            <li className="tick-circle primary">1 board</li>
            <li className="tick-circle primary">Single sign-on</li>
            <li className="tick-circle primary">Unlimited admins</li>
            <li className="tick-circle primary">Unlimited feedbacks</li>
            <li className="tick-circle primary">Unlimited users</li>
          </ul>
        </div>
        <div className="bg-indigo-300 bg-opacity-50 rounded-lg p-8">
          <h2 className="text-3xl">Premium</h2>
          <p className="mb-3">All premium functions</p>
          <h3 className="text-xl">
            <span className="font-bold text-4xl">$19</span>
            /month
          </h3>
          <ul className="mt-6 inline-block">
            <li className="tick-circle primary">Everything in free</li>
            <li className="tick-circle primary">Unlimited boards</li>
            <li className="tick-circle primary">Invite only-boards</li>
            <li className="tick-circle primary">Password protected boards</li>
            <li className="tick-circle primary">Faster support</li>
          </ul>
          <div>
            {isPremium === false && (
              <Button
                onClick={handleUpgradeButtonClick}
                className="bg-primary text-white w-full justify-center mt-2 py-2">
                Upgrade
              </Button>
            )}
            {isPremium === true && (
              <Button
                onClick={handleManageButtonClick}
                className="border border-black border-opacity-20 text-black text-opacity-70 w-full justify-center mt-2 py-2">
                Manage your subscription
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}