
# Abstract
In recent years, out-of-band PIN codes usage for matching/pairing/authentication gained popularity. Those codes are used for a variety of use-cases from claiming ownership of an IoT device to document sharing. The codes are usually four to six characters, numeric or alphanumeric. 
A problem with this approach was recently reported as a security problem in a mobile health care application called Vivy which is used by a group of a healthcare insurance carriers in Germany, claiming that the design was fundamentally insecure. Are all 4-6 digit pin codes insecure ? What if alphanumeric is used? We will demonstrate that a single knowledge factor (pin code) can not be secured, without a stack of additional layers. We further examine alternatives of implementation of a secure method, identify key challenges, and propose a novel, simple to implement solution for rate limiting of these hypersensitive API endpoints.

# Introduction 
We examine some vulnerabilities for existing out-of-band PIN codes for a variety of authentication and authorization use cases. We propose a novel, simple to implement, stateless alternative that uses a variable cost proof-of-work primitive to limit the rate of brute force attacks.

# Outline 

## Background
We work on healthcare applications, and have come across this issue before. What is the the right level of security to grant potentially an not authenticated user access to some medical information. This is a very difficult issue, as there are many many ways how the information needs to be distributed, and yes, they are still printing CDs.

## Why did we became interested?
We have same issues in our own product. So a group of researches from Berlin preformed colonoscopy on Vivy, and among many other problems, we focused on this brute-forcing of document ID attack. The claim is that, for a 5 digit code, 10^5 (100k) permutations is susceptible to brute force. Would making this alphanumeric make it secure? Would 26^6, or 36^6 or 62^6 make it substantially more secure?

## Chainsaw Math 
The range of possible options ranges from 10,000 (for five digits only) and 56,800,235,584 (for five characters consisting of lower+uppercase +digits). For the 5 digits only case, assuming uniform distribution, and 10, 000 active codes in the biggest space, and 10K per second guess attempt rate and 284 seconds on average to discover an active code. Off course to execute this attack one would have to be able to execute 10K attempts per second. So this methodology, of a single knowledge factor (token), has to rely on a token significantly larger then 6 characters to make it computationally infeasible.

## Single Factor Mechanism in unsecure
We need a simple and hassle free for a user to get access to a resource for which a, certain API /v1/authorize?id=XXXXX, receives X, and X is between 0-9. Can rate limiting be implemented with enough specificity ? The rate limit can not be imposed globally, as it’s a ddos of legitimate users, and it seems that every metric or scope we attach the rate limit to can be bypassed by an attacker.
### We can not:
* Limit by IP ( users may be behind proxies, and attacker may use a bonnet)
* Client Persistence (attacker will not be using a browser)
* User Scope (server side persistance), an attacker may user different user account. 

### Conclusion
This leads us to a conclusion that at least two factors must be present, Id and Pincode. The 'id' could be considered as a rate limiting scope. So basically, there has to be a factor which can somehow be tracked and counted. In case of password username is the first factor, and in a case of a matching point, there MUST a notion of a ratelimiting, otherwise the mechanism is brute-forcable.  

## Implementing the the rate limiting factor
There must be a an attempts counter, the time of the last attempt. Maintain a list of pincodes:
• Track the counts of the number of attempts for each active pin code.
• Track the time that pincode first appeared
• Track the time the PIN code it was last attempted.
• Clean up

Architecturally this can be implemented in a modern environment one of two ways:
* Micro service
The issue with this approach is you are allowing potentially malicious traffic to get past you ingress controller. Secondary, is implementation of a service like high availability can be challenging, eventual consistency, etc.
Is there a better alternative? We will review what a more secure implementation would look like as well as what we believe to be a novel alternative. The proposed alternative uses a proof-of-work primitive to assess a variable computational cost for a client to make a request which represents an insignificant delay from a user perspective, but makes a brute force attack against these sensitive endpoints computationally infeasible.

* Ingress Gateway Feature
As a feature of an ingress gateway, or as an application service. For example, this would be possible to implement as an authorizer function in AWS API gateway. Although is it possible to implement it as feature of an ingress gateway, it would require coupling the workload with the ingress gateway which implements critical security logic.
