DRAFT

PRESENTER INFORMATION
Primary Speaker Name or Pseudonym*:
Zeev Glozman 

Primary Speaker Title and Company (if applicable):
API Architect beame.io

Additional Speaker Name(s)/Pseudonym(s)* and Title(s):
Ricardo Gomez, Ilya Sher 

Have any of the speakers spoken at a previous DEF CON? If Yes, which speaker, what year(s), and which talk(s)?
Yes, DEFCON24 I presented an open source ssl audit tool

Primary Speaker Email Address:
zglozman@gmail.com

Backup Email, in case of communication failure (optional):
z@beame.io

Primary Speaker Phone Number:
3123912730 

Co-Speaker(s) Email Address(es):
rg@beame.io

Co-Speaker(s) Phone Number(s):
3123912730
Speakers' Social Media / Personal Site Information (Twitter, Facebook, website, etc)*:
@zglozman

Would you like your submission sent in anonymously to the review board?*: Yes or No
No

PRESENTATION INFORMATION
Date of Submission:
April 30, 2019 

Presentation Title:
Can proof of work be useful for API Security ? 

Length of presentation: (20 minutes, 45 minutes, 105 minutes)
20

Is there a demonstration? Yes or No. If yes, please explain the demonstration.
Yes, we will demonstrate a simulated attack, with an without proof of work, and show the level of utilization of the server. 

Is there audience participation*? Yes or No. If yes, how?
No 

Are you releasing a new tool? Yes or No
Yes, the client libraries and supporting backend code will be made avaliable for nodejs and evoy and AWS 

If you are releasing a new tool:
Under which license? 
MIT

Is it a full tool suite, a plugin, proof of concept exploit, update to existing tool, or something else? 
Is the tool currently public? 
What language is the tool written in? 
Please introduce your tool briefly and explain what it does:
We will provide a client library, as well as a range of possible backend implementations for this usecase.

Are you releasing a new exploit? Yes or No: NO
If you are releasing vulnerabilities, please break them down and abstract as a vulnerability database would. Include the vendor(s), product(s), and version(s) affected here:
NO 

Are there any contingencies that might prevent releasing the exploit (e.g. vendor relationships, coordinated disclosure delays, visa approvals, etc)? Yes or No
No 

Have you submitted or do you plan on submitting this topic to any other conference held prior to DEF CON 27? If yes, please list which conference(s) and their dates.
No

Are you submitting this or any other topic to Black Hat USA? Yes or No. If Yes, please elaborate.
No 

If you answered yes to the previous question, can you ONLY commit to speak at DEF CON if your talk is accepted at Black Hat USA? Yes or No 
Only defcon 

Note: For clarification, this means if your submission to Black Hat's CFP is rejected, you will withdraw your DEF CON Submission.
No 

Are you submitting this or any other topic to BSidesLV? Yes or No. If Yes, please elaborate.
No 

If your DEF CON submission is not accepted for our main tracks, do you consent to allow DEF CON to forward your completed submission to the relevant official DEF CON Villages for their consideration for village content?* Yes or No.
Yes

ABSTRACT (not to exceed 1337 characters):
# Abstract
In recent years, out-of-band PIN codes usage for matching/pairing/authentication gained popularity. Those codes are used for a variety of use cases from claiming ownership of an IoT device to document sharing. The codes are usually four to six characters, numeric or alphanumeric. A security problem with this approach was recently reported in a mobile health care application, which is used by a group of a healthcare insurance carriers in Germany, claiming that the design was fundamentally insecure. Are all 4-6 digit PIN codes insecure? What if alphanumeric is used? 
We will demonstrate that a single knowledge factor (PIN code) cannot be secure without additional layers of protection. We further examine alternatives of implementation, identify key challenges, and propose a novel, simple to implement solution for rate limiting of these hypersensitive API endpoints.


Speaker Bio(s) (not to exceed 1337 characters total):
I am pationate about technology, i like to reuse engineering concepts from one problem to another. I belive that revolution in healthcare apps is about to come, and as such this is the time to think about and address securirty of this medical usecases. 

DETAILED OUTLINE:

# Introduction 
We examine some vulnerabilities for existing out-of-band PIN codes for a variety of authentication and authorization use cases. We propose a novel, simple to implement, stateless alternative that uses a variable cost proof-of-work primitive to limit the rate of brute force attacks.

# Why DEFCON?
* Understanding these mechanisms is critical from attackers and defenders point of view.
* The idea presented leverages some concepts from blockchain in an innovative way.
* We will provide a frame of reference how one can assess a security of a matching API, and brute force suseptibility. 
* The idea is intellectually stimulating and can lead to other developments using cryptographic primitives in new ways.
* To the knowledge of the authors, similar ideas have been used by CTF organizers to prevent brute forcing of challenges submitted, but such methods have received no attention in a greater context of general applicability to the defense of APIs.

## Proof of work
PoW -- Proof of work, A proof of work is a piece of data which is difficult (costly, time-consuming) to produce but easy for others to verify and which satisfies certain requirements. Let our sample string be "Hello, world!". Our target is to find a variation of it that SHA-256 hashes to a value smaller than 2^240 (16 leading zero bits). We vary the string by adding an integer value to the end called a nonce and incrementing it each time, then interpreting the hash result as a long integer and checking whether it's smaller than the target 2^240. For example, finding a match for "Hello, world!" takes us 4251 tries. 

* "Hello, world!2" => ae37343a357a8297591625e7134cbea22f5928be8ca2a32aa475cf05fd4266b7 = 2^255.444730341
* "Hello, world!4248" => 6e110d98b388e77e9c6f042ac6b497cec46660deef75a55ebc7cfdf65cc0b965 = 2^254.782233115
* "Hello, world!4249" => c004190b822f1669cac8dc37e761cb73652e7832fb814565702245cf26ebb9e6 = 2^255.585082774
* "Hello, world!4250" => 0000c3af42fc31103f1fdc0151fa747ff87349a4714df7cc52ea464e12dcd4e9 = 2^239.61238653

# Outline 

## Background
We work on healthcare applications and have come across this issue before: How secure should a mechanism be for granting access to medical information to an otherwise unauthenticated user be? This becomes a hard question, as there are many ways on how the information needs to be distributed, and yes, they are still printing CDs.

## Why did we became interested?
A group of researchers from Berlin performed colonoscopy on Vivy and found many problems. 
We decided to focus on the "brute-forcing of an endpoint with document ID and PIN" since our own products also employ PIN codes.
The claim is that a 5 digit code, 10^5 (100k) permutations, is susceptible to brute force. Would alphanumeric make it secure? Would 26^6, or 36^6 or 62^6 make it substantially more secure?

## Chainsaw Math 
The range of possible options ranges from 10,000 (for five digits only) and 56,800,235,584 (for five characters consisting of lower+uppercase+digits). For the 5 digits only case, assuming uniform distribution, and 10,000 active codes in the biggest space, with a 10K per second guess attempt rate, it would take 284 seconds on average to discover an active code. To execute this attack one would have to be able to execute 10K attempts per second. So this methodology, of a single knowledge factor (identifier), has to rely on a identifier significantly larger then 6 characters to make it computationally infeasible.

## Single Factor Mechanism is insecure
We need a simple and hassle free way for a user to get access to a resource for which a, certain API `.../v1/authorize?id=FIVE_DIGITS_HERE` grants access. Can rate limiting be implemented with enough specificity? The rate limit cannot be imposed globally, as it’s a denial of service for legitimate users, and it seems that every metric or scope we attach the rate limit to can be bypassed by an attacker; we cannot:

* Limit by IP (users may be behind proxies, and attacker may use a bonnet)
* Client Persistence (attacker will not be using a browser)
* User Scope (server side persistence), an attacker may user different user account. 

### Conclusion
At least two factors must be present, Id and PIN code. The 'id' could be considered as a rate limiting scope. So basically, there has to be a factor which can somehow be tracked and counted. In case of password, username is the first factor, and in a case of a matching point, there MUST a notion of a rate-limiting, otherwise the mechanism is brute-forcible.  

## Implementing the conventional rate limiting
There must be an attempts counter, the time of the last attempt. Maintain a system-wide state, per each active PIN comprised of:
* Count of the number of usage attempts.
* Time that the PIN code first appeared.
* Time the PIN code was last usage attempted.

The state of expired PIN codes should be cleaned up.

Architecturally, the proposed rate limiting can be implemented in a modern environment one of two ways:

### Micro service
The issues with this approach is you are:
* Allowing potentially malicious traffic to get past you ingress controller
* Implementation of a service like high availability can be challenging, eventual consistency, etc.

### Ingress Gateway Feature
As a feature of an ingress gateway, or as an application service. For example, this would be possible to implement as an authorizer function in AWS API gateway.

Although it is possible to implement it as feature of an ingress gateway, it would require coupling the workload with the ingress gateway which implements critical security logic.

## Our proposal 

Is there a better alternative to the conventional rate limiting? We will review what a more secure implementation would look like as well as what we believe to be a novel alternative. The proposed alternative uses a proof-of-work primitive to assess a variable computational cost for a client to make a request which represents an insignificant delay from a user perspective, but makes a brute force attack against these sensitive endpoints computationally infeasible.

### Core Idea 
We are looking to create a slow down for the client. What if we requested a client to perform an expensive calculation and the result could be easily validated by the server? This would essentially limit the scope of the implementation to just two places as opposed to other options, which are a lot more technically complex. We believe this feature also provides guarantees, that would allow to rely on this single factor, which would provide for simpler user experience. 

### Hash Difficulty 
Difficulty is a measure of how difficult it is to find a hash below a given target.

### Technical Proposition 
The server or API gateway would perform the validation of the hash in the inbound HTTP request. Responding to the matching request would require the request to have a valid proof of work over specific parts of the request (headers/query parameters/body). It would be very efficient (cheap) for the server side to check and expensive for the client to compute. The server algorithm could be adapted to request increasingly complex hashing requirements based on risk factors associated with each particular request. The logic for determining this can be completely arbitrary. The integration of such feature is simple, in nodejs it can be implemented as server middleware.

### Implementation Details
The client would compute the nonce using the query string, content-type header, and body when available. The data structure of the value shall be as follows [$queryString,  content-type: $value, body: $body], then the nonce would sent as the value of "X-pow-nonce:" HTTP header. 

### Sample Implementation 
To find a nonce to a hash the following function can be used:
```
/**
 * @param  String input         The starting string.
 * @param  int nonce            nonce to validate
 * @param  int difficulty
 * @return bool                 true if valid, false otherwise
 */
function validateWork(input, nonce, difficulty = 4) {
    const sha256 = crypto.createHash('sha256');
    sha256.update(input);
    sha256.update(nonce);
    return sha256.digest('hex').endsWith('0'.repeat(difficulty));
}
```

# Key Takeaways
* When implementing a use case that relies on short id such as a PIN code to grant access to a resource, significant attention has to be given to mitigating a brute-force attack.
* Implementing rate limiting is hard and best left to professionals. (Envoy, Ngnix, API Gateways, etc. )
* The addition of requirement of a proof of work can add a nice layer of protection of access to critical APIs resources.
* This mechanisems are dangeours and hard to implement. 
